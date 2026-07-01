<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationProfile extends Model
{
    protected $fillable = [
        'name',
        'logo_url',
        'visi',
        'misi',
        'sejarah',
        'kontak',
        'is_public_page_active',
    ];

    protected $casts = [
        'is_public_page_active' => 'boolean',
    ];
}
