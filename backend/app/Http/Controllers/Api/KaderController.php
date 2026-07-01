<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kader;
use App\Models\AnggotaKeluarga;
use App\Models\RiwayatPendidikanAnak;
use App\Models\KaderisasiRecord;
use App\Models\KaderRating;
use App\Services\PendidikanEstimatorService;
use Illuminate\Http\Request;

class KaderController extends Controller
{
    /**
     * Get listing of all kaders.
     */
    public function index(Request $request)
    {
        $query = Kader::query();

        if ($request->has('search')) {
            $query->where('nama_lengkap', 'like', '%' . $request->search . '%');
        }

        if ($request->has('status') && $request->status !== '') {
            $query->where('status_keanggotaan', $request->status);
        }

        return response()->json($query->orderBy('nama_lengkap', 'asc')->get());
    }

    /**
     * Get detailed profile of a single kader with family relations.
     */
    public function show(string $id)
    {
        $kader = Kader::with(['user', 'keluargas.riwayatPendidikans' => function ($q) {
            $q->orderBy('tahun_masuk', 'asc');
        }, 'kaderisasiRecords', 'rating'])->findOrFail($id);

        return response()->json($kader);
    }

    /**
     * Store a new kader profile.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'nullable|string|max:16',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status_keanggotaan' => 'required|in:aktif,nonaktif,alumni',
        ]);

        $kader = Kader::create($request->all());

        return response()->json([
            'message' => 'Profil kader berhasil ditambahkan.',
            'kader' => $kader
        ], 210);
    }

    /**
     * Update an existing kader profile.
     */
    public function update(Request $request, string $id)
    {
        $kader = Kader::findOrFail($id);

        $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'nik' => 'nullable|string|max:16',
            'tempat_lahir' => 'nullable|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'status_keanggotaan' => 'required|in:aktif,nonaktif,alumni',
        ]);

        $kader->update($request->all());

        return response()->json([
            'message' => 'Profil kader berhasil diperbarui.',
            'kader' => $kader
        ]);
    }

    /**
     * Delete a kader profile.
     */
    public function destroy(string $id)
    {
        $kader = Kader::findOrFail($id);
        $kader->delete();

        return response()->json([
            'message' => 'Profil kader berhasil dihapus.'
        ]);
    }

    /**
     * Add a family relation to a kader.
     */
    public function storeKeluarga(Request $request, string $kaderId)
    {
        $kader = Kader::findOrFail($kaderId);

        $request->validate([
            'tipe_hubungan' => 'required|in:pasangan,anak',
            'nama' => 'required|string|max:255',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'required|in:L,P',
        ]);

        $keluarga = AnggotaKeluarga::create([
            'kader_id' => $kader->id,
            'tipe_hubungan' => $request->tipe_hubungan,
            'nama' => $request->nama,
            'tanggal_lahir' => $request->tanggal_lahir,
            'jenis_kelamin' => $request->jenis_kelamin,
        ]);

        // If it's a child, generate estimated education timeline
        if ($keluarga->tipe_hubungan === 'anak') {
            PendidikanEstimatorService::estimateTimeline($keluarga);
        }

        return response()->json([
            'message' => 'Anggota keluarga berhasil ditambahkan.',
            'keluarga' => $keluarga->load('riwayatPendidikans')
        ], 210);
    }

    /**
     * Delete a family relation.
     */
    public function destroyKeluarga(string $id)
    {
        $keluarga = AnggotaKeluarga::findOrFail($id);
        $keluarga->delete();

        return response()->json([
            'message' => 'Anggota keluarga berhasil dihapus.'
        ]);
    }

    /**
     * Actualize child school records.
     */
    public function updatePendidikan(Request $request, string $id)
    {
        $pendidikan = RiwayatPendidikanAnak::findOrFail($id);

        $request->validate([
            'nama_sekolah' => 'required|string|max:255',
            'tahun_masuk' => 'required|integer',
        ]);

        $pendidikan->update([
            'nama_sekolah' => $request->nama_sekolah,
            'tahun_masuk' => $request->tahun_masuk,
            'is_estimasi' => false // Mark as verified/actual
        ]);

        return response()->json([
            'message' => 'Riwayat pendidikan berhasil diperbarui.',
            'pendidikan' => $pendidikan
        ]);
    }
    /**
     * Store Kaderisasi Record.
     */
    public function storeKaderisasi(Request $request, string $kaderId)
    {
        $kader = Kader::findOrFail($kaderId);

        $request->validate([
            'jenjang' => 'required|string',
            'tahun_lulus' => 'required|integer',
            'predikat' => 'nullable|string',
            'sertifikat_file' => 'nullable|string',
        ]);

        $record = KaderisasiRecord::create([
            'kader_id' => $kader->id,
            'jenjang' => $request->jenjang,
            'tahun_lulus' => $request->tahun_lulus,
            'predikat' => $request->predikat,
            'sertifikat_file' => $request->sertifikat_file,
        ]);

        return response()->json([
            'message' => 'Riwayat kaderisasi berhasil ditambahkan.',
            'record' => $record
        ], 210);
    }

    /**
     * Delete Kaderisasi Record.
     */
    public function destroyKaderisasi(string $id)
    {
        $record = KaderisasiRecord::findOrFail($id);
        $record->delete();

        return response()->json([
            'message' => 'Riwayat kaderisasi berhasil dihapus.'
        ]);
    }

    /**
     * Update Kader Rating.
     */
    public function updateRating(Request $request, string $kaderId)
    {
        $kader = Kader::findOrFail($kaderId);

        $request->validate([
            'kepemimpinan' => 'required|integer|min:1|max:5',
            'loyalitas' => 'required|integer|min:1|max:5',
            'komunikasi' => 'required|integer|min:1|max:5',
            'kreativitas' => 'required|integer|min:1|max:5',
            'catatan' => 'nullable|string',
        ]);

        $rating = KaderRating::updateOrCreate(
            ['kader_id' => $kader->id],
            [
                'kepemimpinan' => $request->kepemimpinan,
                'loyalitas' => $request->loyalitas,
                'komunikasi' => $request->komunikasi,
                'kreativitas' => $request->kreativitas,
                'catatan' => $request->catatan,
                'rated_by' => auth()->id() ?? 1 // fallback to 1 if not authenticated (should be authed though)
            ]
        );

        return response()->json([
            'message' => 'Rapor kader berhasil diperbarui.',
            'rating' => $rating
        ]);
    }
}
