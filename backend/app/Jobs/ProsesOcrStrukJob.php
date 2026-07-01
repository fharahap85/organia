<?php

namespace App\Jobs;

use App\Models\Struk;
use App\Services\OcrService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class ProsesOcrStrukJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $strukId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $strukId)
    {
        $this->strukId = $strukId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $struk = Struk::findOrFail($this->strukId);

        // Get absolute file path from public storage
        // file_gambar_path is stored as "storage/dokumentasi/filename.jpg" or "storage/keuangan/filename.jpg"
        // Let's resolve the path
        $relativeStoragePath = str_replace('storage/', '', $struk->file_gambar_path);
        $absolutePath = Storage::disk('public')->path($relativeStoragePath);

        if (file_exists($absolutePath)) {
            // Run OCR parsing
            $extractedData = OcrService::parseReceipt($absolutePath);

            // Update model
            $struk->update([
                'nominal' => $extractedData['nominal'],
                'tanggal_transaksi' => $extractedData['tanggal_transaksi'],
                'nama_vendor' => $extractedData['nama_vendor'],
                'ocr_raw_text' => $extractedData['ocr_raw_text'],
                'low_confidence_flags' => $extractedData['low_confidence_flags'],
            ]);
        }
    }
}
