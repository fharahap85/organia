<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RiwayatPendidikanAnak extends Model
{
    use SoftDeletes;

    protected $table = 'riwayat_pendidikan_anaks';

    protected $fillable = [
        'anggota_keluarga_id',
        'jenjang',
        'nama_sekolah',
        'tahun_masuk',
        'is_estimasi',
    ];

    protected $casts = [
        'is_estimasi' => 'boolean',
    ];

    public function anak()
    {
        return $this->belongsTo(AnggotaKeluarga::class, 'anggota_keluarga_id');
    }
}
