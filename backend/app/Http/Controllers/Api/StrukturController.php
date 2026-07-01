<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StrukturOrganisasi;
use App\Models\PeriodeKepengurusan;
use Illuminate\Http\Request;

class StrukturController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $periodeId = $request->query('periode_id');

        if (!$periodeId) {
            $activePeriod = PeriodeKepengurusan::where('is_active', true)->first();
            $periodeId = $activePeriod ? $activePeriod->id : null;
        }

        if (!$periodeId) {
            return response()->json([]);
        }

        // Return flat list or hierarchical structure
        $nodes = StrukturOrganisasi::with('user.role')
            ->where('periode_id', $periodeId)
            ->get();

        return response()->json($nodes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'periode_id' => 'required|exists:periode_kepengurusans,id',
            'parent_id' => 'nullable|exists:struktur_organisasis,id',
            'jabatan' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $struktur = StrukturOrganisasi::create([
            'periode_id' => $request->periode_id,
            'parent_id' => $request->parent_id,
            'jabatan' => $request->jabatan,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Struktur organisasi berhasil ditambahkan.',
            'struktur' => $struktur->load('user'),
        ], 210);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $struktur = StrukturOrganisasi::with(['user', 'parent', 'children'])->findOrFail($id);
        return response()->json($struktur);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $struktur = StrukturOrganisasi::findOrFail($id);

        $request->validate([
            'parent_id' => 'nullable|exists:struktur_organisasis,id',
            'jabatan' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $struktur->update([
            'parent_id' => $request->parent_id,
            'jabatan' => $request->jabatan,
            'user_id' => $request->user_id,
        ]);

        return response()->json([
            'message' => 'Struktur organisasi berhasil diubah.',
            'struktur' => $struktur->load('user'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $struktur = StrukturOrganisasi::findOrFail($id);
        
        // Update children to point to parent of deleted node to avoid orphan branches
        StrukturOrganisasi::where('parent_id', $struktur->id)
            ->update(['parent_id' => $struktur->parent_id]);

        $struktur->delete();

        return response()->json([
            'message' => 'Node struktur organisasi berhasil dihapus.',
        ]);
    }
}
