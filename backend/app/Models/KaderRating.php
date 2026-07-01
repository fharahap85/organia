<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KaderRating extends Model
{
    protected $table = 'kader_ratings';

    protected $fillable = [
        'kader_id',
        'kepemimpinan',
        'loyalitas',
        'komunikasi',
        'kreativitas',
        'catatan',
        'rated_by',
    ];

    public function kader()
    {
        return $this->belongsTo(Kader::class, 'kader_id');
    }

    public function rater()
    {
        return $this->belongsTo(User::class, 'rated_by');
    }
}
