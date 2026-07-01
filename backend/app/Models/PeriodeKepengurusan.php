<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class PeriodeKepengurusan extends Model
{
    use Trackable, SoftDeletes;

    protected $fillable = [
        'nama_periode',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'periode_id');
    }

    public function strukturOrganisasi()
    {
        return $this->hasMany(StrukturOrganisasi::class, 'periode_id');
    }
}
