<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnggotaKeluarga extends Model
{
    use SoftDeletes;

    protected $table = 'anggota_keluargas';

    protected $fillable = [
        'kader_id',
        'tipe_hubungan',
        'nama',
        'tanggal_lahir',
        'jenis_kelamin',
    ];

    protected $casts = [
        'tanggal_lahir' => 'encrypted',
    ];

    public function kader()
    {
        return $this->belongsTo(Kader::class, 'kader_id');
    }

    public function riwayatPendidikans()
    {
        return $this->hasMany(RiwayatPendidikanAnak::class, 'anggota_keluarga_id');
    }
}
