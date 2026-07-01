<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class Struk extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'struks';

    protected $fillable = [
        'agenda_id',
        'file_gambar_path',
        'nominal',
        'tanggal_transaksi',
        'nama_vendor',
        'status_verifikasi',
        'ocr_raw_text',
        'low_confidence_flags',
    ];

    protected $casts = [
        'low_confidence_flags' => 'array',
        'tanggal_transaksi' => 'date',
    ];

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'agenda_id');
    }
}
