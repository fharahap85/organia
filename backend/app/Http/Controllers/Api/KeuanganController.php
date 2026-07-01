<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Struk;
use App\Models\Agenda;
use App\Jobs\ProsesOcrStrukJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class KeuanganController extends Controller
{
    /**
     * Display a listing of receipts.
     */
    public function index(Request $request)
    {
        $query = Struk::with('agenda');

        if ($request->has('agenda_id')) {
            $query->where('agenda_id', $request->agenda_id);
        }

        if ($request->has('status')) {
            $query->where('status_verifikasi', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Upload a new receipt and trigger OCR job.
     */
    public function store(Request $request)
    {
        $request->validate([
            'agenda_id' => 'required|exists:agendas,id',
            'file_gambar' => 'required|image|mimes:jpeg,png,webp,jpg|max:10240', // Max 10MB
        ]);

        $file = $request->file('file_gambar');
        $path = $file->store('keuangan', 'public');
        $filePath = 'storage/' . $path;

        $struk = Struk::create([
            'agenda_id' => $request->agenda_id,
            'file_gambar_path' => $filePath,
            'status_verifikasi' => 'pending',
            'nominal' => 0,
            'created_by' => auth()->id(),
        ]);

        // Dispatch background OCR process
        ProsesOcrStrukJob::dispatch($struk->id);

        return response()->json([
            'message' => 'Foto struk berhasil diunggah. AI sedang mengekstrak data di background.',
            'struk' => $struk->load('agenda')
        ], 210);
    }

    /**
     * Update/Verify receipt details manually by Bendahara.
     */
    public function update(Request $request, string $id)
    {
        $struk = Struk::findOrFail($id);

        $request->validate([
            'nominal' => 'required|integer|min:0',
            'tanggal_transaksi' => 'required|date',
            'nama_vendor' => 'required|string|max:255',
            'status_verifikasi' => 'required|in:pending,verified,rejected',
        ]);

        $struk->update([
            'nominal' => $request->nominal,
            'tanggal_transaksi' => $request->tanggal_transaksi,
            'nama_vendor' => $request->nama_vendor,
            'status_verifikasi' => $request->status_verifikasi,
            'low_confidence_flags' => null, // Clear flags after manual verification
        ]);

        return response()->json([
            'message' => 'Data struk berhasil diverifikasi & disimpan.',
            'struk' => $struk->load('agenda')
        ]);
    }

    /**
     * Delete receipt and its physical file.
     */
    public function destroy(string $id)
    {
        $struk = Struk::findOrFail($id);

        // Delete physical file
        $relativeStoragePath = str_replace('storage/', '', $struk->file_gambar_path);
        if (Storage::disk('public')->exists($relativeStoragePath)) {
            Storage::disk('public')->delete($relativeStoragePath);
        }

        $struk->delete();

        return response()->json([
            'message' => 'Arsip struk berhasil dihapus.'
        ]);
    }

    /**
     * Get financial summary per agenda.
     */
    public function summary()
    {
        $agendas = Agenda::withCount('absensis')->get();
        $summary = [];

        foreach ($agendas as $agenda) {
            $totalExpenses = Struk::where('agenda_id', $agenda->id)
                ->where('status_verifikasi', 'verified')
                ->sum('nominal');

            // Generate some dummy funding for mock charts:
            // Let's assume some basic allocation or calculate expenses
            $summary[] = [
                'agenda_id' => $agenda->id,
                'judul' => $agenda->judul,
                'total_pengeluaran' => intval($totalExpenses),
                'anggaran_kegiatan' => 5000000, // Static mock budget Rp 5.000.000
                'sisa_anggaran' => max(0, 5000000 - $totalExpenses),
            ];
        }

        return response()->json($summary);
    }

    /**
     * Export all verified receipts summary as PDF.
     */
    public function exportPdf()
    {
        $struks = Struk::where('status_verifikasi', 'verified')->with('agenda')->orderBy('tanggal_transaksi', 'asc')->get();
        $totalNominal = $struks->sum('nominal');

        $html = '
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; font-size: 13px; color: #333; line-height: 1.5; }
                h2 { text-align: center; margin-bottom: 2px; }
                .sub { text-align: center; font-size: 11px; color: #666; margin-bottom: 25px; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                th { background-color: #f3f4f6; font-weight: bold; border: 1px solid #d1d5db; padding: 8px; text-align: left; }
                td { border: 1px solid #d1d5db; padding: 8px; }
                .total-row { font-weight: bold; background-color: #f9fafb; }
                .right { text-align: right; }
            </style>
        </head>
        <body>
            <h2>LAPORAN KEUANGAN & PENGELUARAN KEGIATAN</h2>
            <p class="sub">SIM Organia Keuangan • Periode Aktif berjalan</p>
            
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Kegiatan / Agenda</th>
                        <th>Vendor</th>
                        <th class="right">Nominal</th>
                    </tr>
                </thead>
                <tbody>';

        foreach ($struks as $s) {
            $date = $s->tanggal_transaksi ? $s->tanggal_transaksi->format('d-m-Y') : '-';
            $html .= '
                    <tr>
                        <td>' . $date . '</td>
                        <td>' . $s->agenda->judul . '</td>
                        <td>' . $s->nama_vendor . '</td>
                        <td class="right">Rp ' . number_format($s->nominal, 0, ',', '.') . '</td>
                    </tr>';
        }

        $html .= '
                    <tr class="total-row">
                        <td colspan="3" class="right">Total Pengeluaran Terverifikasi:</td>
                        <td class="right">Rp ' . number_format($totalNominal, 0, ',', '.') . '</td>
                    </tr>
                </tbody>
            </table>
        </body>
        </html>';

        $pdf = Pdf::loadHTML($html);
        return $pdf->download('laporan_keuangan_kegiatan_' . date('Ymd_His') . '.pdf');
    }
}
