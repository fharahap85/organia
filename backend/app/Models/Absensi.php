<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Absensi extends Model
{
    use SoftDeletes;

    protected $table = 'absensis';

    protected $fillable = [
        'agenda_id',
        'data_kehadiran',
        'waktu_hadir',
        'ditambahkan_oleh',
    ];

    protected $casts = [
        'data_kehadiran' => 'array',
        'waktu_hadir' => 'datetime',
    ];

    public function agenda()
    {
        return $this->belongsTo(Agenda::class, 'agenda_id');
    }

    public function operator()
    {
        return $this->belongsTo(User::class, 'ditambahkan_oleh');
    }
}
