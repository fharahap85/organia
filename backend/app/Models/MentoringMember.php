<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentoringMember extends Model
{
    protected $table = 'mentoring_members';

    protected $fillable = [
        'mentoring_group_id',
        'kader_id',
        'status',
    ];

    public function group()
    {
        return $this->belongsTo(MentoringGroup::class, 'mentoring_group_id');
    }

    public function kader()
    {
        return $this->belongsTo(Kader::class, 'kader_id');
    }
}
