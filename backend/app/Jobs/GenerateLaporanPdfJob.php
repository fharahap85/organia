<?php

namespace App\Jobs;

use App\Models\LaporanBulanan;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class GenerateLaporanPdfJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $laporanId;
    protected $data;

    /**
     * Create a new job instance.
     */
    public function __construct(int $laporanId, array $data)
    {
        $this->laporanId = $laporanId;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $laporan = LaporanBulanan::findOrFail($this->laporanId);
        $d = $this->data;

        // Compile HTML template
        $html = '
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; font-size: 12px; color: #333; line-height: 1.4; }
                .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px; }
                .title { font-size: 18px; font-weight: bold; color: #1e3a8a; margin: 0; }
                .subtitle { font-size: 11px; color: #4b5563; margin: 5px 0 0 0; }
                .section-title { font-size: 14px; font-weight: bold; border-left: 3px solid #3b82f6; padding-left: 6px; margin: 20px 0 10px 0; color: #1e3a8a; }
                .stats-grid { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .stats-box { border: 1px solid #d1d5db; padding: 12px; width: 25%; text-align: center; background-color: #f9fafb; }
                .stats-num { font-size: 16px; font-weight: bold; color: #3b82f6; margin-bottom: 4px; }
                .stats-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
                table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                table.data-table th { background-color: #f3f4f6; border: 1px solid #d1d5db; padding: 6px 8px; text-align: left; }
                table.data-table td { border: 1px solid #d1d5db; padding: 6px 8px; }
                .gallery { width: 100%; margin-top: 15px; }
                .gallery-item { display: inline-block; width: 31%; border: 1px solid #e5e7eb; padding: 4px; margin-right: 1.5%; margin-bottom: 10px; vertical-align: top; }
                .gallery-img { width: 100%; height: 80px; object-cover: cover; }
                .gallery-caption { font-size: 9px; color: #6b7280; text-align: center; margin-top: 3px; }
                .footer { position: fixed; bottom: 0; left: 0; right: 0; height: 30px; border-top: 1px solid #e5e7eb; font-size: 9px; color: #9ca3af; text-align: center; line-height: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <p class="title">LAPORAN AKHIR BULAN ORGANISASI</p>
                <p class="subtitle">SIM Organia • Bulan: ' . $d['bulan_nama'] . ' ' . $d['tahun'] . ' • Tipe: ' . ucfirst($d['tipe_laporan']) . ($d['bidang'] ? ' (' . $d['bidang'] . ')' : '') . '</p>
            </div>

            <div class="section-title">Ringkasan Aktivitas</div>
            <table class="stats-grid">
                <tr>
                    <td class="stats-box">
                        <div class="stats-num">' . $d['agendas_count'] . '</div>
                        <div class="stats-label">Agenda Selesai</div>
                    </td>
                    <td class="stats-box">
                        <div class="stats-num">' . $d['average_attendance'] . '</div>
                        <div class="stats-label">Rata Kehadiran</div>
                    </td>
                    <td class="stats-box">
                        <div class="stats-num">Rp ' . number_format($d['total_expenses'], 0, ',', '.') . '</div>
                        <div class="stats-label">Total Belanja</div>
                    </td>
                    <td class="stats-box">
                        <div class="stats-num">' . ($d['surat_keluar_count'] + $d['surat_masuk_count']) . '</div>
                        <div class="stats-label">Surat Masuk/Keluar</div>
                    </td>
                </tr>
            </table>

            <div class="section-title">Daftar Agenda terlaksana</div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nama Kegiatan</th>
                        <th>Tanggal</th>
                        <th>Lokasi</th>
                        <th style="text-align: right;">Hadir (Orang)</th>
                    </tr>
                </thead>
                <tbody>';

        if (empty($d['agendas_list'])) {
            $html .= '<tr><td colspan="4" style="text-align: center; color: #9ca3af;">Tidak ada agenda terlaksana pada periode ini.</td></tr>';
        } else {
            foreach ($d['agendas_list'] as $ag) {
                $html .= '
                    <tr>
                        <td>' . $ag['judul'] . '</td>
                        <td>' . $ag['tanggal'] . '</td>
                        <td>' . $ag['lokasi'] . '</td>
                        <td style="text-align: right;">' . $ag['hadir'] . '</td>
                    </tr>';
            }
        }

        $html .= '
                </tbody>
            </table>

            <div class="section-title">Dokumentasi Terlampir</div>';

        if (empty($d['docs'])) {
            $html .= '<p style="color: #9ca3af; font-style: italic;">Tidak ada foto dokumentasi kegiatan untuk bulan ini.</p>';
        } else {
            $html .= '<div class="gallery">';
            foreach ($d['docs'] as $idx => $img) {
                // Ensure we link from local storage
                $absoluteImgPath = public_path($img['path']);
                // Use standard HTML table for PDF rendering safety rather than flex grids
                $html .= '
                <div class="gallery-item">
                    <img class="gallery-img" src="' . $absoluteImgPath . '">
                    <div class="gallery-caption">' . ($img['caption'] ?: 'Foto Kegiatan') . '</div>
                </div>';
            }
            $html .= '</div>';
        }

        $html .= '
            <div class="footer">
                Laporan digenerate otomatis oleh SIM Organia pada ' . date('d-m-Y H:i') . ' • Halaman 1 dari 1
            </div>
        </body>
        </html>';

        // Render PDF
        $pdf = Pdf::loadHTML($html);
        $fileName = 'laporan_bulanan_' . $d['bulan'] . '_' . $d['tahun'] . '_' . time() . '.pdf';
        
        // Save PDF to public/laporan disk directory
        $pdfContent = $pdf->output();
        Storage::disk('public')->put('laporan/' . $fileName, $pdfContent);

        // Update database record
        $laporan->update([
            'file_pdf_path' => 'storage/laporan/' . $fileName
        ]);
    }
}
