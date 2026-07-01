<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class SuratMasuk extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'surat_masuks';

    protected $fillable = [
        'nomor_surat',
        'tanggal_terima',
        'pengirim',
        'perihal',
        'file_lampiran_path',
        'status_tindak_lanjut',
        'disposisi_ke_bidang',
    ];

    protected $casts = [
        'tanggal_terima' => 'date',
    ];
}
