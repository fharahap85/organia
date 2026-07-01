<?php

namespace App\Services;

use App\Models\Surat;
use Carbon\Carbon;

class SuratService
{
    /**
     * Generate sequential letter number.
     * Format: {sequence}/{code}/{month_roman}/{year}
     * Example: 001/SEK/VII/2026
     */
    public static function generateNomorSurat(string $jenisSurat): string
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;

        // Map month to Roman numeral
        $romans = [
            1 => 'I', 2 => 'II', 3 => 'III', 4 => 'IV', 5 => 'V', 6 => 'VI',
            7 => 'VII', 8 => 'VIII', 9 => 'IX', 10 => 'X', 11 => 'XI', 12 => 'XII'
        ];
        $romanMonth = $romans[$month] ?? 'I';

        // Map jenisSurat to code prefix
        $codeMap = [
            'Keputusan' => 'SK',
            'Undangan' => 'UND',
            'Pengantar' => 'SPG',
            'Keterangan' => 'SKET',
            'Pemberitahuan' => 'PBM',
        ];
        $code = $codeMap[$jenisSurat] ?? 'SUR';

        // Get count of surats in the current year to determine sequence
        $count = Surat::whereYear('tanggal_surat', $year)->count();
        $sequence = str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        return "{$sequence}/{$code}/{$romanMonth}/{$year}";
    }
}
