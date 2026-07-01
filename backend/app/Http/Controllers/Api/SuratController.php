<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemplateSurat;
use App\Models\Surat;
use App\Models\SuratMasuk;
use App\Jobs\GenerateBulkSuratJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SuratController extends Controller
{
    // ==========================================
    // 1. TEMPLATE SURAT ENDPOINTS
    // ==========================================

    public function indexTemplate()
    {
        return response()->json(TemplateSurat::orderBy('judul_template', 'asc')->get());
    }

    public function storeTemplate(Request $request)
    {
        $request->validate([
            'judul_template' => 'required|string|max:255',
            'jenis_surat' => 'required|string|in:Keputusan,Undangan,Pengantar,Keterangan,Pemberitahuan',
            'konten_html' => 'required|string',
        ]);

        // Auto-extract placeholders (between {{ and }})
        preg_match_all('/\{\{([^}]+)\}\}/', $request->konten_html, $matches);
        $placeholders = array_values(array_unique($matches[1] ?? []));

        // Filter out system placeholders like nomor_surat and tanggal_surat
        $placeholders = array_values(array_filter($placeholders, function ($ph) {
            return !in_array(trim($ph), ['nomor_surat', 'tanggal_surat']);
        }));

        $template = TemplateSurat::create([
            'judul_template' => $request->judul_template,
            'jenis_surat' => $request->jenis_surat,
            'konten_html' => $request->konten_html,
            'layout_config' => ['placeholders' => $placeholders],
        ]);

        return response()->json([
            'message' => 'Template surat berhasil disimpan.',
            'template' => $template
        ], 210);
    }

    public function showTemplate(string $id)
    {
        return response()->json(TemplateSurat::findOrFail($id));
    }

    public function updateTemplate(Request $request, string $id)
    {
        $template = TemplateSurat::findOrFail($id);

        $request->validate([
            'judul_template' => 'required|string|max:255',
            'jenis_surat' => 'required|string|in:Keputusan,Undangan,Pengantar,Keterangan,Pemberitahuan',
            'konten_html' => 'required|string',
        ]);

        preg_match_all('/\{\{([^}]+)\}\}/', $request->konten_html, $matches);
        $placeholders = array_values(array_unique($matches[1] ?? []));
        $placeholders = array_values(array_filter($placeholders, function ($ph) {
            return !in_array(trim($ph), ['nomor_surat', 'tanggal_surat']);
        }));

        $template->update([
            'judul_template' => $request->judul_template,
            'jenis_surat' => $request->jenis_surat,
            'konten_html' => $request->konten_html,
            'layout_config' => ['placeholders' => $placeholders],
        ]);

        return response()->json([
            'message' => 'Template surat berhasil diubah.',
            'template' => $template
        ]);
    }

    public function destroyTemplate(string $id)
    {
        $template = TemplateSurat::findOrFail($id);
        
        if ($template->surats()->exists()) {
            return response()->json([
                'message' => 'Template tidak dapat dihapus karena telah digunakan untuk men-generate surat.'
            ], 400);
        }

        $template->delete();

        return response()->json([
            'message' => 'Template surat berhasil dihapus.'
        ]);
    }

    // ==========================================
    // 2. SURAT KELUAR (ARSIP & BULK GENERATE)
    // ==========================================

    public function indexSuratKeluar(Request $request)
    {
        $query = Surat::with('template');

        if ($request->has('jenis_surat')) {
            $query->where('jenis_surat', $request->jenis_surat);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                  ->orWhere('penerima_nama', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    public function generateSurat(Request $request)
    {
        $request->validate([
            'template_id' => 'required|exists:template_surats,id',
            'status_ttd' => 'required|boolean',
            'penerima_list' => 'required|array',
            'penerima_list.*.nama' => 'required|string',
        ]);

        // Dispatch bulk generation job to Laravel queue
        GenerateBulkSuratJob::dispatch(
            $request->template_id,
            $request->penerima_list,
            $request->status_ttd,
            auth()->id()
        );

        return response()->json([
            'message' => 'Proses generate surat massal telah dijadwalkan di background. Silakan cek arsip beberapa saat lagi.'
        ], 202);
    }

    // ==========================================
    // 3. SURAT MASUK CRUD
    // ==========================================

    public function indexSuratMasuk(Request $request)
    {
        $query = SuratMasuk::query();

        if ($request->has('status')) {
            $query->where('status_tindak_lanjut', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nomor_surat', 'like', "%{$search}%")
                  ->orWhere('pengirim', 'like', "%{$search}%")
                  ->orWhere('perihal', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('tanggal_terima', 'desc')->get());
    }

    public function storeSuratMasuk(Request $request)
    {
        $request->validate([
            'nomor_surat' => 'required|string|max:255',
            'tanggal_terima' => 'required|date',
            'pengirim' => 'required|string|max:255',
            'perihal' => 'required|string|max:255',
            'file_lampiran' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:5120', // Max 5MB
            'status_tindak_lanjut' => 'required|in:pending,diproses,selesai',
            'disposisi_ke_bidang' => 'nullable|string',
        ]);

        $filePath = null;
        if ($request->hasFile('file_lampiran')) {
            $filePath = $request->file('file_lampiran')->store('surat_masuk', 'public');
            $filePath = 'storage/' . $filePath;
        }

        $suratMasuk = SuratMasuk::create([
            'nomor_surat' => $request->nomor_surat,
            'tanggal_terima' => $request->tanggal_terima,
            'pengirim' => $request->pengirim,
            'perihal' => $request->perihal,
            'file_lampiran_path' => $filePath,
            'status_tindak_lanjut' => $request->status_tindak_lanjut,
            'disposisi_ke_bidang' => $request->disposisi_ke_bidang,
        ]);

        return response()->json([
            'message' => 'Surat masuk berhasil diarsipkan.',
            'surat_masuk' => $suratMasuk
        ], 210);
    }

    public function updateSuratMasuk(Request $request, string $id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);

        $request->validate([
            'nomor_surat' => 'required|string|max:255',
            'tanggal_terima' => 'required|date',
            'pengirim' => 'required|string|max:255',
            'perihal' => 'required|string|max:255',
            'file_lampiran' => 'nullable|file|mimes:pdf,jpg,png,jpeg|max:5120',
            'status_tindak_lanjut' => 'required|in:pending,diproses,selesai',
            'disposisi_ke_bidang' => 'nullable|string',
        ]);

        $filePath = $suratMasuk->file_lampiran_path;
        if ($request->hasFile('file_lampiran')) {
            // Delete old file if exists
            if ($filePath) {
                Storage::disk('public')->delete(str_replace('storage/', '', $filePath));
            }
            $filePath = $request->file('file_lampiran')->store('surat_masuk', 'public');
            $filePath = 'storage/' . $filePath;
        }

        $suratMasuk->update([
            'nomor_surat' => $request->nomor_surat,
            'tanggal_terima' => $request->tanggal_terima,
            'pengirim' => $request->pengirim,
            'perihal' => $request->perihal,
            'file_lampiran_path' => $filePath,
            'status_tindak_lanjut' => $request->status_tindak_lanjut,
            'disposisi_ke_bidang' => $request->disposisi_ke_bidang,
        ]);

        return response()->json([
            'message' => 'Surat masuk berhasil diubah.',
            'surat_masuk' => $suratMasuk
        ]);
    }

    public function destroySuratMasuk(string $id)
    {
        $suratMasuk = SuratMasuk::findOrFail($id);
        
        if ($suratMasuk->file_lampiran_path) {
            Storage::disk('public')->delete(str_replace('storage/', '', $suratMasuk->file_lampiran_path));
        }

        $suratMasuk->delete();

        return response()->json([
            'message' => 'Surat masuk berhasil dihapus.'
        ]);
    }

    // ==========================================
    // 4. VERIFIKASI TTD DIGITAL (PUBLIC ENDPOINT)
    // ==========================================

    public function verifikasiSurat(string $uuid_verifikasi)
    {
        $surat = Surat::where('uuid_verifikasi', $uuid_verifikasi)->with('creator')->firstOrFail();

        return response()->json([
            'valid' => true,
            'nomor_surat' => $surat->nomor_surat,
            'tanggal_surat' => $surat->tanggal_surat->toDateString(),
            'jenis_surat' => $surat->jenis_surat,
            'penerima_nama' => $surat->penerima_nama,
            'status_ttd' => $surat->status_ttd,
            'pembuat' => $surat->creator ? $surat->creator->name : 'Sistem',
            'pesan' => 'DOKUMEN INI ASLI. Terverifikasi secara digital oleh sistem SIM Organia.'
        ]);
    }
}
