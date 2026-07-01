<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DokumentasiKegiatan extends Model
{
    use SoftDeletes;

    protected $table = 'dokumentasi_kegiatans';

    protected $fillable = [
        'agenda_id',
        'file_path',
        'tipe_file',
        'caption',
        'uploaded_by',
    ];

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'agenda_id');
    }

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
