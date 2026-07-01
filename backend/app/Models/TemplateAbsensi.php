<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class TemplateAbsensi extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'template_absensis';

    protected $fillable = [
        'nama_template',
        'skema_kolom',
    ];

    protected $casts = [
        'skema_kolom' => 'array',
    ];

    public function agendas()
    {
        return $this->hasMany(Agenda::class, 'template_absensi_id');
    }
}
