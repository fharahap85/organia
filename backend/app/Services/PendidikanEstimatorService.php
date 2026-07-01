<?php

namespace App\Services;

use App\Models\AnggotaKeluarga;
use App\Models\RiwayatPendidikanAnak;
use Carbon\Carbon;

class PendidikanEstimatorService
{
    /**
     * Calculate and store estimated education timeline for a child.
     */
    public static function estimateTimeline(AnggotaKeluarga $anak): void
    {
        if ($anak->tipe_hubungan !== 'anak' || !$anak->tanggal_lahir) {
            return;
        }

        try {
            $birthDate = Carbon::parse($anak->tanggal_lahir);
        } catch (\Exception $e) {
            return;
        }

        $birthYear = $birthDate->year;

        // Definition of entry age for each stage:
        $stages = [
            'TK' => 5,
            'SD' => 7,
            'SMP' => 13,
            'SMA' => 16,
            'Kuliah' => 19,
        ];

        foreach ($stages as $jenjang => $age) {
            $tahunMasuk = $birthYear + $age;

            // Check if record already exists
            $existing = RiwayatPendidikanAnak::where('anggota_keluarga_id', $anak->id)
                ->where('jenjang', $jenjang)
                ->first();

            if ($existing) {
                // Only update if it is still an estimation
                if ($existing->is_estimasi) {
                    $existing->update([
                        'tahun_masuk' => $tahunMasuk
                    ]);
                }
            } else {
                // Create new estimation
                RiwayatPendidikanAnak::create([
                    'anggota_keluarga_id' => $anak->id,
                    'jenjang' => $jenjang,
                    'tahun_masuk' => $tahunMasuk,
                    'is_estimasi' => true,
                ]);
            }
        }
    }
}
