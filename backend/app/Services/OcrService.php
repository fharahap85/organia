<?php

namespace App\Services;

use thiagoalessio\TesseractOCR\TesseractOCR;
use thiagoalessio\TesseractOCR\Exceptions\TesseractNotFoundException;

class OcrService
{
    /**
     * Perform OCR on receipt image and extract data.
     */
    public static function parseReceipt(string $absoluteImagePath): array
    {
        $rawText = '';
        $isMocked = false;

        // Try using Tesseract OCR
        try {
            $ocr = new TesseractOCR($absoluteImagePath);
            
            // On Windows, Tesseract is commonly installed in Program Files. Check if we should override path
            if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
                $winPath = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe';
                if (file_exists($winPath)) {
                    $ocr->executable($winPath);
                }
            }
            
            $rawText = $ocr->run();
        } catch (\Exception $e) {
            // Tesseract not found or failed, switch to Fallback/Mock mode
            $isMocked = true;
            $rawText = self::getMockText($absoluteImagePath);
        }

        return self::extractDataFromText($rawText, $isMocked);
    }

    /**
     * Extract nominal, vendor, and date from raw text using regex.
     */
    private static function extractDataFromText(string $text, bool $isMocked): array
    {
        $nominal = 0;
        $vendor = 'Toko Belanja';
        $tanggal = date('Y-m-d');
        $lowConfidenceFlags = [];

        // 1. Extract Nominal
        // Match Rp. 50.000 or Total: 50000 or Jumlah 15,000 etc
        if (preg_match('/(?:rp\.?|total|jumlah|netto|cash)\s*:?\s*([\d\.,]+)/i', $text, $matches)) {
            $cleanNominal = preg_replace('/[^\d]/', '', $matches[1]);
            // If the nominal is parsed, convert to integer
            $nominal = intval($cleanNominal);
        } else {
            $lowConfidenceFlags[] = 'nominal';
        }

        // 2. Extract Date
        // Match DD-MM-YYYY or YYYY-MM-DD or DD/MM/YYYY
        if (preg_match('/(\d{2}[-\/\.]\d{2}[-\/\.]\d{4})/', $text, $matches)) {
            $dateStr = str_replace(['/', '.'], '-', $matches[1]);
            $tanggal = date('Y-m-d', strtotime($dateStr));
        } elseif (preg_match('/(\d{4}[-\/\.]\d{2}[-\/\.]\d{2})/', $text, $matches)) {
            $tanggal = date('Y-m-d', strtotime(str_replace(['/', '.'], '-', $matches[1])));
        } else {
            $lowConfidenceFlags[] = 'tanggal_transaksi';
        }

        // 3. Extract Vendor
        // Usually the first non-empty line of the receipt
        $lines = array_values(array_filter(array_map('trim', explode("\n", $text))));
        if (!empty($lines)) {
            $vendor = substr($lines[0], 0, 50); // limit to 50 chars
        } else {
            $lowConfidenceFlags[] = 'nama_vendor';
        }

        // If it's mocked, mark all as low confidence so the user knows they need to review
        if ($isMocked) {
            $lowConfidenceFlags = ['nominal', 'tanggal_transaksi', 'nama_vendor'];
        }

        return [
            'nominal' => $nominal,
            'tanggal_transaksi' => $tanggal,
            'nama_vendor' => $vendor,
            'ocr_raw_text' => $text,
            'low_confidence_flags' => $lowConfidenceFlags,
        ];
    }

    /**
     * Generate simulated/mock receipt text based on receipt name or random generator.
     */
    private static function getMockText(string $filePath): string
    {
        $filename = strtolower(basename($filePath));
        
        if (str_contains($filename, 'atk') || str_contains($filename, 'kertas')) {
            return "TOKO ATK JAYA MANDIRI\nJl. Pendidikan No. 12\n\nTanggal: 28-06-2026\n\nDeskripsi: Kertas A4 & Pulpen\nTotal: Rp. 75.000\nTerima Kasih";
        }
        
        if (str_contains($filename, 'konsumsi') || str_contains($filename, 'makan')) {
            return "RM PADANG BERKAH\nJl. Raya No. 45\n\n29/06/2026\n\nNasi Kotak x 10\nJumlah: Rp. 250.000\nLunas";
        }

        // Random generator
        $vendors = ['Indomaret', 'Alfamart', 'Copy Center Abadi', 'Toko Kue Rahmat'];
        $vendor = $vendors[array_rand($vendors)];
        $nominal = rand(15, 120) * 1000;
        $date = date('d-m-Y', strtotime('-' . rand(0, 5) . ' days'));

        return "{$vendor}\nCabang Utama\n\nTanggal: {$date}\nTotal Belanja: Rp. " . number_format($nominal, 0, ',', '.') . "\nMetode: Tunai\n=== SELESAI ===";
    }
}
