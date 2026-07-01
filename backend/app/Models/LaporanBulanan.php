<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LaporanBulanan extends Model
{
    use SoftDeletes;

    protected $table = 'laporan_bulanans';

    protected $fillable = [
        'bulan',
        'tahun',
        'tipe_laporan',
        'bidang',
        'file_pdf_path',
        'generated_by',
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
