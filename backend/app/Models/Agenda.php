<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class Agenda extends Model
{
    use Trackable, SoftDeletes;

    protected $fillable = [
        'judul',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'lokasi',
        'bidang_penyelenggara',
        'status',
        'is_publik',
        'uuid_qr',
        'template_absensi_id',
    ];

    protected $casts = [
        'is_publik' => 'boolean',
        'tanggal_mulai' => 'datetime',
        'tanggal_selesai' => 'datetime',
    ];

    public function templateAbsensi()
    {
        return $this->belongsTo(TemplateAbsensi::class, 'template_absensi_id');
    }

    public function absensis()
    {
        return $this->hasMany(Absensi::class, 'agenda_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function dokumentasis()
    {
        return $this->hasMany(DokumentasiKegiatan::class, 'agenda_id');
    }
}
