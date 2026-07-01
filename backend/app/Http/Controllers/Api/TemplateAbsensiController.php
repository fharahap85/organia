<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TemplateAbsensi;
use Illuminate\Http\Request;

class TemplateAbsensiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(TemplateAbsensi::orderBy('nama_template', 'asc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama_template' => 'required|string|max:255',
            'skema_kolom' => 'required|array',
            'skema_kolom.*.name' => 'required|string',
            'skema_kolom.*.type' => 'required|string|in:text,number,select,textarea',
            'skema_kolom.*.label' => 'required|string',
            'skema_kolom.*.required' => 'required|boolean',
            'skema_kolom.*.options' => 'nullable|array', // array of strings for select options
        ]);

        $template = TemplateAbsensi::create([
            'nama_template' => $request->nama_template,
            'skema_kolom' => $request->skema_kolom,
        ]);

        return response()->json([
            'message' => 'Template absensi berhasil dibuat.',
            'template' => $template
        ], 210);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $template = TemplateAbsensi::findOrFail($id);
        return response()->json($template);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $template = TemplateAbsensi::findOrFail($id);

        $request->validate([
            'nama_template' => 'required|string|max:255',
            'skema_kolom' => 'required|array',
            'skema_kolom.*.name' => 'required|string',
            'skema_kolom.*.type' => 'required|string|in:text,number,select,textarea',
            'skema_kolom.*.label' => 'required|string',
            'skema_kolom.*.required' => 'required|boolean',
            'skema_kolom.*.options' => 'nullable|array',
        ]);

        $template->update([
            'nama_template' => $request->nama_template,
            'skema_kolom' => $request->skema_kolom,
        ]);

        return response()->json([
            'message' => 'Template absensi berhasil diubah.',
            'template' => $template
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $template = TemplateAbsensi::findOrFail($id);
        
        // Prevent deletion if template is used by any agenda
        if ($template->agendas()->exists()) {
            return response()->json([
                'message' => 'Template tidak bisa dihapus karena sedang digunakan oleh satu atau beberapa agenda.'
            ], 400);
        }

        $template->delete();

        return response()->json([
            'message' => 'Template absensi berhasil dihapus.'
        ]);
    }
}
