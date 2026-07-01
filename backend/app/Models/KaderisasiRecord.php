<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KaderisasiRecord extends Model
{
    protected $table = 'kaderisasi_records';

    protected $fillable = [
        'kader_id',
        'jenjang',
        'tahun_lulus',
        'predikat',
        'sertifikat_file',
    ];

    public function kader()
    {
        return $this->belongsTo(Kader::class, 'kader_id');
    }
}
