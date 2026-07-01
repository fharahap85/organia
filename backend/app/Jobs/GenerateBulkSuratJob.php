<?php

namespace App\Jobs;

use App\Models\TemplateSurat;
use App\Models\Surat;
use App\Services\SuratService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class GenerateBulkSuratJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $templateId;
    protected $penerimaList;
    protected $statusTtd;
    protected $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $templateId, array $penerimaList, bool $statusTtd, int $userId)
    {
        $this->templateId = $templateId;
        $this->penerimaList = $penerimaList;
        $this->statusTtd = $statusTtd;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $template = TemplateSurat::findOrFail($this->templateId);

        foreach ($this->penerimaList as $penerima) {
            $uuidVerifikasi = (string) Str::uuid();
            $nomorSurat = SuratService::generateNomorSurat($template->jenis_surat);
            
            // Build placeholder mappings
            $placeholders = $penerima; // e.g. ['nama' => 'John', 'jabatan' => 'Kader']
            $placeholders['nomor_surat'] = $nomorSurat;
            $placeholders['tanggal_surat'] = date('d-m-Y');

            // Replace placeholders in HTML content
            $kontenHtml = $template->konten_html;
            foreach ($placeholders as $key => $val) {
                $kontenHtml = str_replace('{{' . $key . '}}', $val, $kontenHtml);
            }

            // If TTD digital is enabled, append QR code verification section
            $verificationUrl = config('app.frontend_url', 'http://localhost:5173') . '/verifikasi-surat/' . $uuidVerifikasi;
            $ttdHtml = '';
            
            if ($this->statusTtd) {
                // Generate PNG base64 QR Code
                $qrBase64 = base64_encode(QrCode::format('png')->size(100)->color(0, 0, 0)->generate($verificationUrl));
                
                $ttdHtml = '
                <div style="margin-top: 60px; float: right; text-align: center; width: 250px;">
                    <p style="margin-bottom: 5px;"><strong>Ketua Organisasi</strong></p>
                    <img src="data:image/png;base64,' . $qrBase64 . '" width="90" height="90" style="display: block; margin: 0 auto 5px;" />
                    <p style="font-size: 9px; color: #555; line-height: 1.2;">
                        Ditandatangani secara digital.<br>
                        Scan untuk verifikasi keaslian.
                    </p>
                </div>
                <div style="clear: both;"></div>';
            }

            // Wrap in basic HTML layout
            $fullHtml = '
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: sans-serif; font-size: 14px; line-height: 1.6; color: #333; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 30px; }
                    .header h2 { margin: 0 0 5px; font-size: 20px; }
                    .header p { margin: 0; font-size: 12px; color: #666; }
                    .content { margin-bottom: 40px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>PENGURUS ORGANISASI ORGANIA</h2>
                    <p>SIM Organisasi & Manajemen Kaderisasi • Email: info@organia.local</p>
                </div>
                <div class="content">
                    ' . $kontenHtml . '
                </div>
                ' . $ttdHtml . '
            </body>
            </html>';

            // Generate PDF using Barryvdh\DomPDF
            $pdf = Pdf::loadHTML($fullHtml);
            
            // Save file
            $filename = 'surat_' . $uuidVerifikasi . '.pdf';
            $filePath = 'surat/' . $filename;
            
            // Ensure directory exists
            Storage::disk('public')->makeDirectory('surat');
            Storage::disk('public')->put($filePath, $pdf->output());

            // Save record
            Surat::create([
                'nomor_surat' => $nomorSurat,
                'tanggal_surat' => date('Y-m-d'),
                'jenis_surat' => $template->jenis_surat,
                'template_id' => $template->id,
                'penerima_nama' => $penerima['nama'] ?? 'Umum/Penerima',
                'penerima_data_json' => $penerima,
                'status_ttd' => $this->statusTtd,
                'file_pdf_path' => 'storage/' . $filePath,
                'uuid_verifikasi' => $uuidVerifikasi,
                'created_by' => $this->userId,
            ]);
        }
    }
}
