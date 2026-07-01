<?php

namespace Tests\Unit\Services;

use App\Models\Surat;
use App\Models\TemplateSurat;
use App\Services\SuratService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SuratServiceTest extends TestCase
{
    use RefreshDatabase;

    private function createSurat(array $overrides = []): Surat
    {
        $template = TemplateSurat::firstOrCreate(
            ['judul_template' => 'Default'],
            ['judul_template' => 'Default', 'jenis_surat' => 'Keputusan', 'konten_html' => '<p>Test</p>']
        );

        return Surat::create(array_merge([
            'nomor_surat' => '001/SK/VII/2026',
            'jenis_surat' => 'Keputusan',
            'tanggal_surat' => now(),
            'template_id' => $template->id,
            'penerima_nama' => 'Test',
            'penerima_data_json' => [],
            'uuid_verifikasi' => \Str::uuid(),
        ], $overrides));
    }

    public function test_generates_correct_format_for_keputusan(): void
    {
        $result = SuratService::generateNomorSurat('Keputusan');

        $this->assertMatchesRegularExpression('/^001\/SK\/[IVXLCDM]+\/\d{4}$/', $result);
    }

    public function test_maps_all_jenis_surat_to_codes(): void
    {
        $cases = [
            'Keputusan' => 'SK',
            'Undangan' => 'UND',
            'Pengantar' => 'SPG',
            'Keterangan' => 'SKET',
            'Pemberitahuan' => 'PBM',
        ];

        foreach ($cases as $jenis => $expectedCode) {
            $result = SuratService::generateNomorSurat($jenis);
            $this->assertStringContainsString("/{$expectedCode}/", $result);
        }
    }

    public function test_uses_sur_code_for_unknown_jenis(): void
    {
        $result = SuratService::generateNomorSurat('Lainnya');

        $this->assertStringContainsString('/SUR/', $result);
    }

    public function test_increments_sequence_with_existing_surats(): void
    {
        $year = now()->year;
        $this->createSurat(['nomor_surat' => '001/SK/VII/' . $year, 'jenis_surat' => 'Keputusan']);
        $this->createSurat(['nomor_surat' => '002/SK/VII/' . $year, 'jenis_surat' => 'Keputusan']);

        $result = SuratService::generateNomorSurat('Keputusan');

        $this->assertStringStartsWith('003/', $result);
    }

    public function test_includes_correct_month_roman(): void
    {
        $result = SuratService::generateNomorSurat('Undangan');
        $month = now()->month;

        $romans = [1=>'I',2=>'II',3=>'III',4=>'IV',5=>'V',6=>'VI',7=>'VII',8=>'VIII',9=>'IX',10=>'X',11=>'XI',12=>'XII'];
        $this->assertStringContainsString("/{$romans[$month]}/", $result);
    }
}
