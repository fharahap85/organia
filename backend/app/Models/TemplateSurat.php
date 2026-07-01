<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\Trackable;

class TemplateSurat extends Model
{
    use Trackable, SoftDeletes;

    protected $table = 'template_surats';

    protected $fillable = [
        'judul_template',
        'jenis_surat',
        'konten_html',
        'layout_config',
    ];

    protected $casts = [
        'layout_config' => 'array',
    ];

    public function surats()
    {
        return $this->hasMany(Surat::class, 'template_id');
    }
}
