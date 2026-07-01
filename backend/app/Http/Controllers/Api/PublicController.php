<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrganizationProfile;
use App\Models\StrukturOrganisasi;
use App\Models\PeriodeKepengurusan;
use App\Models\Agenda;

class PublicController extends Controller
{
    private function checkPublicAccess()
    {
        $profile = OrganizationProfile::first();
        if (!$profile || !$profile->is_public_page_active) {
            abort(403, 'Halaman publik saat ini dinonaktifkan.');
        }
        return $profile;
    }

    public function getProfile()
    {
        return response()->json($this->checkPublicAccess());
    }

    public function getStruktur()
    {
        $this->checkPublicAccess();

        $periodeAktif = PeriodeKepengurusan::where('status', 'Aktif')->first();
        if (!$periodeAktif) {
            return response()->json([]);
        }

        $struktur = StrukturOrganisasi::with('user', 'parent')
            ->where('periode_id', $periodeAktif->id)
            ->get();

        return response()->json($struktur);
    }

    public function getAgendas()
    {
        $this->checkPublicAccess();

        $agendas = Agenda::where('is_publik', true)
            ->where('status', '!=', 'draft')
            ->orderBy('tanggal_mulai', 'asc')
            ->get(['id', 'judul', 'deskripsi', 'tanggal_mulai', 'tanggal_selesai', 'lokasi', 'status']);

        return response()->json($agendas);
    }
}
