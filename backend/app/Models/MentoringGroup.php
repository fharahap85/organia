<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentoringGroup extends Model
{
    protected $table = 'mentoring_groups';

    protected $fillable = [
        'nama_kelompok',
        'mentor_id',
        'tingkat',
        'status',
    ];

    public function mentor()
    {
        return $this->belongsTo(Kader::class, 'mentor_id');
    }

    public function members()
    {
        return $this->hasMany(MentoringMember::class, 'mentoring_group_id');
    }
}
