<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AgendaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Agenda::with('templateAbsensi');

        // BIPEKA, Kaderisasi, Bendahara can only see their department's agendas
        // Superadmin, Ketua, Sekretaris can see all
        if ($user->role && !in_array($user->role->name, ['Superadmin', 'Ketua', 'Sekretaris'])) {
            $query->where('bidang_penyelenggara', $user->role->name);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('judul', 'like', "%{$search}%");
        }

        return response()->json($query->orderBy('tanggal_mulai', 'desc')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'required|string|max:255',
            'bidang_penyelenggara' => 'required|string',
            'status' => 'required|in:draft,aktif,selesai',
            'is_publik' => 'required|boolean',
            'template_absensi_id' => 'required|exists:template_absensis,id',
        ]);

        $agenda = Agenda::create([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi' => $request->lokasi,
            'bidang_penyelenggara' => $request->bidang_penyelenggara,
            'status' => $request->status,
            'is_publik' => $request->is_publik,
            'template_absensi_id' => $request->template_absensi_id,
            'uuid_qr' => (string) Str::uuid(),
        ]);

        return response()->json([
            'message' => 'Agenda berhasil dibuat.',
            'agenda' => $agenda->load('templateAbsensi')
        ], 210);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $agenda = Agenda::with(['templateAbsensi', 'absensis.operator'])->findOrFail($id);
        return response()->json($agenda);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $agenda = Agenda::findOrFail($id);

        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'lokasi' => 'required|string|max:255',
            'bidang_penyelenggara' => 'required|string',
            'status' => 'required|in:draft,aktif,selesai',
            'is_publik' => 'required|boolean',
            'template_absensi_id' => 'required|exists:template_absensis,id',
        ]);

        $agenda->update([
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'lokasi' => $request->lokasi,
            'bidang_penyelenggara' => $request->bidang_penyelenggara,
            'status' => $request->status,
            'is_publik' => $request->is_publik,
            'template_absensi_id' => $request->template_absensi_id,
        ]);

        return response()->json([
            'message' => 'Agenda berhasil diubah.',
            'agenda' => $agenda->load('templateAbsensi')
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $agenda = Agenda::findOrFail($id);
        $agenda->delete();

        return response()->json([
            'message' => 'Agenda berhasil dihapus.'
        ]);
    }

    /**
     * Generate QR Code for the specific agenda.
     */
    public function qr(string $id)
    {
        $agenda = Agenda::findOrFail($id);
        $absensiUrl = config('app.frontend_url', 'http://localhost:5173') . '/absen/' . $agenda->uuid_qr;

        // Generate QrCode as inline SVG string
        $qrCodeSvg = QrCode::size(300)
            ->color(79, 70, 229) // Indigo-600 color
            ->backgroundColor(255, 255, 255)
            ->generate($absensiUrl);

        return response()->json([
            'qr_code_svg' => (string) $qrCodeSvg,
            'url' => $absensiUrl
        ]);
    }
}
