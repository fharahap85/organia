<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kader extends Model
{
    use SoftDeletes;

    protected $table = 'kaders';

    protected $fillable = [
        'user_id',
        'nama_lengkap',
        'nik',
        'tempat_lahir',
        'tanggal_lahir',
        'alamat',
        'no_hp',
        'email',
        'status_keanggotaan',
    ];

    protected $casts = [
        'nik' => 'encrypted',
        'tanggal_lahir' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function keluargas()
    {
        return $this->hasMany(AnggotaKeluarga::class, 'kader_id');
    }

    public function kaderisasiRecords()
    {
        return $this->hasMany(KaderisasiRecord::class, 'kader_id')->orderBy('tahun_lulus', 'asc');
    }

    public function rating()
    {
        return $this->hasOne(KaderRating::class, 'kader_id');
    }

    public function mentoringGroups()
    {
        return $this->hasMany(MentoringGroup::class, 'mentor_id');
    }

    public function mentoringMemberships()
    {
        return $this->hasMany(MentoringMember::class, 'kader_id');
    }
}
