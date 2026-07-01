<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\DokumentasiKegiatan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DokumentasiController extends Controller
{
    /**
     * Get list of documentation for a specific agenda.
     */
    public function index(string $agendaId)
    {
        $agenda = Agenda::findOrFail($agendaId);
        $docs = DokumentasiKegiatan::where('agenda_id', $agenda->id)
            ->with('uploader')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($docs);
    }

    /**
     * Upload documentation file for an agenda.
     */
    public function store(Request $request, string $agendaId)
    {
        $agenda = Agenda::findOrFail($agendaId);

        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,webp,jpg,mp4|max:102400', // Max 100MB (for video support)
            'caption' => 'nullable|string|max:255',
        ]);

        $file = $request->file('file');
        
        // Determine file type (image or video) based on extension/mime
        $mime = $file->getClientMimeType();
        $type = str_contains($mime, 'video') ? 'video' : 'image';

        // Store file
        $path = $file->store('dokumentasi', 'public');
        $filePath = 'storage/' . $path;

        // Save record
        $doc = DokumentasiKegiatan::create([
            'agenda_id' => $agenda->id,
            'file_path' => $filePath,
            'tipe_file' => $type,
            'caption' => $request->caption,
            'uploaded_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Dokumentasi berhasil diunggah.',
            'dokumentasi' => $doc->load('uploader')
        ], 210);
    }

    /**
     * Delete a documentation record and its physical file.
     */
    public function destroy(string $id)
    {
        $doc = DokumentasiKegiatan::findOrFail($id);

        // Delete physical file
        $relativeStoragePath = str_replace('storage/', '', $doc->file_path);
        if (Storage::disk('public')->exists($relativeStoragePath)) {
            Storage::disk('public')->delete($relativeStoragePath);
        }

        $doc->delete();

        return response()->json([
            'message' => 'Dokumentasi berhasil dihapus.'
        ]);
    }
}
