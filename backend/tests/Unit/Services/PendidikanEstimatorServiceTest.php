<?php

namespace Tests\Unit\Services;

use App\Models\AnggotaKeluarga;
use App\Models\Kader;
use App\Models\RiwayatPendidikanAnak;
use App\Services\PendidikanEstimatorService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PendidikanEstimatorServiceTest extends TestCase
{
    use RefreshDatabase;

    private function createAnak(array $overrides = []): AnggotaKeluarga
    {
        $kader = Kader::create(['nama_lengkap' => 'Test Kader']);
        return AnggotaKeluarga::create(array_merge([
            'kader_id' => $kader->id,
            'nama' => 'Anak Test',
            'tipe_hubungan' => 'anak',
            'tanggal_lahir' => '2015-06-15',
        ], $overrides));
    }

    public function test_creates_five_estimated_records_for_child(): void
    {
        $anak = $this->createAnak();

        PendidikanEstimatorService::estimateTimeline($anak);

        $records = RiwayatPendidikanAnak::where('anggota_keluarga_id', $anak->id)->get();
        $this->assertCount(5, $records);

        $expected = ['TK' => 2020, 'SD' => 2022, 'SMP' => 2028, 'SMA' => 2031, 'Kuliah' => 2034];
        foreach ($expected as $jenjang => $year) {
            $record = $records->firstWhere('jenjang', $jenjang);
            $this->assertNotNull($record, "Record for {$jenjang} not found");
            $this->assertEquals($year, $record->tahun_masuk);
            $this->assertTrue($record->is_estimasi);
        }
    }

    public function test_skips_when_type_is_not_anak(): void
    {
        $anak = $this->createAnak(['tipe_hubungan' => 'pasangan']);

        PendidikanEstimatorService::estimateTimeline($anak);

        $this->assertCount(0, RiwayatPendidikanAnak::all());
    }

    public function test_skips_when_tanggal_lahir_is_null(): void
    {
        $anak = $this->createAnak(['tanggal_lahir' => null]);

        PendidikanEstimatorService::estimateTimeline($anak);

        $this->assertCount(0, RiwayatPendidikanAnak::all());
    }

    public function test_does_not_overwrite_actualized_records(): void
    {
        $anak = $this->createAnak();

        // Create an actualized record first
        RiwayatPendidikanAnak::create([
            'anggota_keluarga_id' => $anak->id,
            'jenjang' => 'SD',
            'tahun_masuk' => 2020,
            'is_estimasi' => false,
        ]);

        PendidikanEstimatorService::estimateTimeline($anak);

        $sdRecord = RiwayatPendidikanAnak::where('anggota_keluarga_id', $anak->id)
            ->where('jenjang', 'SD')->first();
        $this->assertEquals(2020, $sdRecord->tahun_masuk);
        $this->assertFalse($sdRecord->is_estimasi);
    }
}
