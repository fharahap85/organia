<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrganizationProfile;
use Illuminate\Http\Request;

class OrganizationProfileController extends Controller
{
    public function show()
    {
        $profile = OrganizationProfile::first();
        if (!$profile) {
            $profile = OrganizationProfile::create([
                'name' => 'Organia',
                'is_public_page_active' => true,
            ]);
        }
        return response()->json($profile);
    }

    public function update(Request $request)
    {
        $profile = OrganizationProfile::first();
        if (!$profile) {
            $profile = OrganizationProfile::create(['name' => 'Organia']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo_url' => 'nullable|string',
            'visi' => 'nullable|string',
            'misi' => 'nullable|string',
            'sejarah' => 'nullable|string',
            'kontak' => 'nullable|string',
            'is_public_page_active' => 'boolean',
        ]);

        $profile->update($validated);

        return response()->json([
            'message' => 'Profil organisasi berhasil diperbarui.',
            'profile' => $profile,
        ]);
    }
}
