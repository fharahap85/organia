<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class StrukturOrganisasi extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'struktur_organisasis';

    protected $fillable = [
        'periode_id',
        'parent_id',
        'jabatan',
        'user_id',
    ];

    public function periode()
    {
        return $this->belongsTo(PeriodeKepengurusan::class, 'periode_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function parent()
    {
        return $this->belongsTo(StrukturOrganisasi::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(StrukturOrganisasi::class, 'parent_id');
    }
}
