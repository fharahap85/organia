<?php

namespace Tests\Unit\Services;

use App\Models\Agenda;
use App\Models\Absensi;
use App\Models\Struk;
use App\Models\Surat;
use App\Models\SuratMasuk;
use App\Models\DokumentasiKegiatan;
use App\Services\LaporanGeneratorService;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LaporanGeneratorServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_zero_avgs_for_empty_month(): void
    {
        $result = LaporanGeneratorService::compileData(1, 2026);

        $this->assertEquals(0, $result['agendas_count']);
        $this->assertEquals(0, $result['average_attendance']);
        $this->assertEquals(0, $result['total_expenses']);
    }

    public function test_counts_agendas_in_date_range(): void
    {
        Agenda::create([
            'judul' => 'Agenda Januari',
            'tanggal_mulai' => '2026-01-15 10:00:00',
            'tanggal_selesai' => '2026-01-15 12:00:00',
            'lokasi' => 'Gedung A',
            'bidang_penyelenggara' => 'Sekretaris',
            'status' => 'aktif',
            'uuid_qr' => \Str::uuid(),
        ]);

        Agenda::create([
            'judul' => 'Agenda Februari',
            'tanggal_mulai' => '2026-02-20 10:00:00',
            'tanggal_selesai' => '2026-02-20 12:00:00',
            'lokasi' => 'Gedung B',
            'bidang_penyelenggara' => 'Sekretaris',
            'status' => 'aktif',
            'uuid_qr' => \Str::uuid(),
        ]);

        $result = LaporanGeneratorService::compileData(1, 2026);

        $this->assertEquals(1, $result['agendas_count']);
        $this->assertEquals('Agenda Januari', $result['agendas_list'][0]['judul']);
    }

    public function test_sums_verified_expenses_only(): void
    {
        $agenda = Agenda::create([
            'judul' => 'Test',
            'tanggal_mulai' => '2026-01-15 10:00:00',
            'tanggal_selesai' => '2026-01-15 12:00:00',
            'lokasi' => 'Gedung A',
            'bidang_penyelenggara' => 'Sekretaris',
            'status' => 'aktif',
            'uuid_qr' => \Str::uuid(),
        ]);

        Struk::create(['agenda_id' => $agenda->id, 'nominal' => 500000, 'status_verifikasi' => 'verified', 'file_gambar_path' => 'test.jpg']);
        Struk::create(['agenda_id' => $agenda->id, 'nominal' => 300000, 'status_verifikasi' => 'pending', 'file_gambar_path' => 'test2.jpg']);
        Struk::create(['agenda_id' => $agenda->id, 'nominal' => 200000, 'status_verifikasi' => 'rejected', 'file_gambar_path' => 'test3.jpg']);

        $result = LaporanGeneratorService::compileData(1, 2026);

        $this->assertEquals(500000, $result['total_expenses']);
        $this->assertEquals(1, $result['pending_receipts_count']);
    }

    public function test_calculates_average_attendance(): void
    {
        $a1 = Agenda::create([
            'judul' => 'A1', 'tanggal_mulai' => '2026-01-10 10:00:00', 'tanggal_selesai' => '2026-01-10 12:00:00',
            'lokasi' => 'X', 'bidang_penyelenggara' => 'Sekretaris', 'status' => 'aktif', 'uuid_qr' => \Str::uuid(),
        ]);
        $a2 = Agenda::create([
            'judul' => 'A2', 'tanggal_mulai' => '2026-01-20 10:00:00', 'tanggal_selesai' => '2026-01-20 12:00:00',
            'lokasi' => 'Y', 'bidang_penyelenggara' => 'Sekretaris', 'status' => 'aktif', 'uuid_qr' => \Str::uuid(),
        ]);

        Absensi::create(['agenda_id' => $a1->id, 'data_kehadiran' => ['nama' => 'A'], 'waktu_hadir' => now()]);
        Absensi::create(['agenda_id' => $a1->id, 'data_kehadiran' => ['nama' => 'B'], 'waktu_hadir' => now()]);
        Absensi::create(['agenda_id' => $a1->id, 'data_kehadiran' => ['nama' => 'C'], 'waktu_hadir' => now()]);
        Absensi::create(['agenda_id' => $a1->id, 'data_kehadiran' => ['nama' => 'D'], 'waktu_hadir' => now()]);
        Absensi::create(['agenda_id' => $a2->id, 'data_kehadiran' => ['nama' => 'E'], 'waktu_hadir' => now()]);
        Absensi::create(['agenda_id' => $a2->id, 'data_kehadiran' => ['nama' => 'F'], 'waktu_hadir' => now()]);

        $result = LaporanGeneratorService::compileData(1, 2026);

        // avg = (4 + 6) / 2 = 5.0 -- wait, 4 + 2 = 6, 6/2 = 3
        $this->assertEquals(3.0, $result['average_attendance']);
    }

    public function test_filters_by_bidang_when_per_bidang(): void
    {
        Agenda::create([
            'judul' => 'Sekretaris Event', 'tanggal_mulai' => '2026-01-10 10:00:00', 'tanggal_selesai' => '2026-01-10 12:00:00',
            'lokasi' => 'X', 'bidang_penyelenggara' => 'Sekretaris', 'status' => 'aktif', 'uuid_qr' => \Str::uuid(),
        ]);
        Agenda::create([
            'judul' => 'BIPEKA Event', 'tanggal_mulai' => '2026-01-15 10:00:00', 'tanggal_selesai' => '2026-01-15 12:00:00',
            'lokasi' => 'Y', 'bidang_penyelenggara' => 'BIPEKA', 'status' => 'aktif', 'uuid_qr' => \Str::uuid(),
        ]);

        $result = LaporanGeneratorService::compileData(1, 2026, 'per_bidang', 'Sekretaris');

        $this->assertEquals(1, $result['agendas_count']);
        $this->assertEquals('Sekretaris', $result['bidang']);
    }
}
