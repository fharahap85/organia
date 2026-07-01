<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PeriodeKepengurusan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PeriodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(PeriodeKepengurusan::orderBy('tanggal_mulai', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_periode' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'is_active' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($request) {
            if ($request->is_active) {
                // Deactivate other periods
                PeriodeKepengurusan::where('is_active', true)->update(['is_active' => false]);
            }

            $periode = PeriodeKepengurusan::create([
                'nama_periode' => $request->nama_periode,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'is_active' => $request->is_active,
            ]);

            return response()->json([
                'message' => 'Periode kepengurusan berhasil dibuat.',
                'periode' => $periode
            ], 210);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $periode = PeriodeKepengurusan::findOrFail($id);
        return response()->json($periode);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $periode = PeriodeKepengurusan::findOrFail($id);

        $request->validate([
            'nama_periode' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'is_active' => 'required|boolean',
        ]);

        return DB::transaction(function () use ($request, $periode) {
            if ($request->is_active && !$periode->is_active) {
                // Deactivate other periods
                PeriodeKepengurusan::where('is_active', true)->update(['is_active' => false]);
            }

            $periode->update([
                'nama_periode' => $request->nama_periode,
                'tanggal_mulai' => $request->tanggal_mulai,
                'tanggal_selesai' => $request->tanggal_selesai,
                'is_active' => $request->is_active,
            ]);

            return response()->json([
                'message' => 'Periode kepengurusan berhasil diubah.',
                'periode' => $periode
            ]);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $periode = PeriodeKepengurusan::findOrFail($id);

        if ($periode->is_active) {
            return response()->json(['message' => 'Tidak bisa menghapus periode yang sedang aktif.'], 400);
        }

        $periode->delete();

        return response()->json([
            'message' => 'Periode kepengurusan berhasil dihapus (soft delete).',
        ]);
    }
}
