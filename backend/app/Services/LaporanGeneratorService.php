<?php

namespace App\Services;

use App\Models\Agenda;
use App\Models\Struk;
use App\Models\Surat;
use App\Models\SuratMasuk;
use Carbon\Carbon;

class LaporanGeneratorService
{
    /**
     * Compile statistical summary of organizational activities.
     */
    public static function compileData(int $bulan, int $tahun, string $tipeLaporan = 'gabungan', ?string $bidang = null): array
    {
        $startDate = Carbon::create($tahun, $bulan, 1)->startOfMonth();
        $endDate = Carbon::create($tahun, $bulan, 1)->endOfMonth();

        // 1. Fetch Agendas in selected month
        $agendaQuery = Agenda::whereBetween('tanggal_mulai', [$startDate, $endDate]);
        if ($tipeLaporan === 'per_bidang' && $bidang) {
            $agendaQuery->where('bidang_penyelenggara', $bidang);
        }
        $agendas = $agendaQuery->withCount('absensis')->with('dokumentasis')->get();

        // 2. Fetch Keuangan (Struks) for these agendas
        $agendaIds = $agendas->pluck('id')->toArray();
        
        $verifiedExpenses = Struk::whereIn('agenda_id', $agendaIds)
            ->where('status_verifikasi', 'verified')
            ->sum('nominal');

        $pendingReceiptsCount = Struk::whereIn('agenda_id', $agendaIds)
            ->where('status_verifikasi', 'pending')
            ->count();

        // 3. Fetch mail counts in that month
        $suratKeluarQuery = Surat::whereBetween('created_at', [$startDate, $endDate]);
        $suratMasukQuery = SuratMasuk::whereBetween('tanggal_terima', [$startDate, $endDate]);
        
        $suratKeluarCount = $suratKeluarQuery->count();
        $suratMasukCount = $suratMasukQuery->count();

        // 4. Calculate attendance stats
        $totalHadir = 0;
        foreach ($agendas as $a) {
            $totalHadir += $a->absensis_count;
        }
        $averageHadir = count($agendas) > 0 ? round($totalHadir / count($agendas), 1) : 0;

        // 5. Gather documentations
        $docs = [];
        foreach ($agendas as $a) {
            foreach ($a->dokumentasis as $doc) {
                if ($doc->tipe_file === 'image') {
                    $docs[] = [
                        'agenda' => $a->judul,
                        'path' => $doc->file_path,
                        'caption' => $doc->caption,
                    ];
                }
            }
        }

        return [
            'bulan_nama' => $startDate->translatedFormat('F'),
            'bulan' => $bulan,
            'tahun' => $tahun,
            'tipe_laporan' => $tipeLaporan,
            'bidang' => $bidang,
            'agendas_count' => count($agendas),
            'agendas_list' => $agendas->map(function ($a) {
                return [
                    'id' => $a->id,
                    'judul' => $a->judul,
                    'lokasi' => $a->lokasi,
                    'tanggal' => $a->tanggal_mulai->format('d-m-Y'),
                    'hadir' => $a->absensis_count,
                ];
            })->toArray(),
            'total_expenses' => intval($verifiedExpenses),
            'pending_receipts_count' => $pendingReceiptsCount,
            'surat_keluar_count' => $suratKeluarCount,
            'surat_masuk_count' => $suratMasukCount,
            'average_attendance' => $averageHadir,
            'docs' => array_slice($docs, 0, 6), // Limit to 6 photos in PDF
        ];
    }
}
