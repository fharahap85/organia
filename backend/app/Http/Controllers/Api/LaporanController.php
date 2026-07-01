<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LaporanBulanan;
use App\Services\LaporanGeneratorService;
use App\Jobs\GenerateLaporanPdfJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LaporanController extends Controller
{
    /**
     * Get list of all generated reports.
     */
    public function index()
    {
        $laporan = LaporanBulanan::with('generator')
            ->orderBy('tahun', 'desc')
            ->orderBy('bulan', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($laporan);
    }

    /**
     * Preview report statistics before generating the PDF file.
     */
    public function preview(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020|max:2050',
            'tipe_laporan' => 'required|in:gabungan,per_bidang',
            'bidang' => 'nullable|string',
        ]);

        $data = LaporanGeneratorService::compileData(
            $request->bulan,
            $request->tahun,
            $request->tipe_laporan,
            $request->bidang
        );

        return response()->json($data);
    }

    /**
     * Generate report record and dispatch PDF rendering job.
     */
    public function store(Request $request)
    {
        $request->validate([
            'bulan' => 'required|integer|between:1,12',
            'tahun' => 'required|integer|min:2020|max:2050',
            'tipe_laporan' => 'required|in:gabungan,per_bidang',
            'bidang' => 'nullable|string',
        ]);

        // Build report data
        $data = LaporanGeneratorService::compileData(
            $request->bulan,
            $request->tahun,
            $request->tipe_laporan,
            $request->bidang
        );

        // Save report record
        $laporan = LaporanBulanan::create([
            'bulan' => $request->bulan,
            'tahun' => $request->tahun,
            'tipe_laporan' => $request->tipe_laporan,
            'bidang' => $request->bidang,
            'generated_by' => auth()->id(),
        ]);

        // Dispatch background worker
        GenerateLaporanPdfJob::dispatch($laporan->id, $data);

        return response()->json([
            'message' => 'Laporan bulanan sedang digenerate. File PDF akan tersedia dalam beberapa saat.',
            'laporan' => $laporan->load('generator')
        ], 210);
    }

    /**
     * Delete report record and its physical PDF.
     */
    public function destroy(string $id)
    {
        $laporan = LaporanBulanan::findOrFail($id);

        if ($laporan->file_pdf_path) {
            $relativeStoragePath = str_replace('storage/', '', $laporan->file_pdf_path);
            if (Storage::disk('public')->exists($relativeStoragePath)) {
                Storage::disk('public')->delete($relativeStoragePath);
            }
        }

        $laporan->delete();

        return response()->json([
            'message' => 'Laporan bulanan berhasil dihapus.'
        ]);
    }
}
