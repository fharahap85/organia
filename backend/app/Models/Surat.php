<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class Surat extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'surats';

    protected $fillable = [
        'nomor_surat',
        'tanggal_surat',
        'jenis_surat',
        'template_id',
        'penerima_nama',
        'penerima_data_json',
        'status_ttd',
        'file_pdf_path',
        'uuid_verifikasi',
    ];

    protected $casts = [
        'penerima_data_json' => 'array',
        'status_ttd' => 'boolean',
        'tanggal_surat' => 'date',
    ];

    public function template()
    {
        return $this->belongsTo(TemplateSurat::class, 'template_id');
    }
}
