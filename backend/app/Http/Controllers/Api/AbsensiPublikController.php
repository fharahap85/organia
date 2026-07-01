<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agenda;
use App\Models\Absensi;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AbsensiPublikController extends Controller
{
    /**
     * Get Agenda and its dynamic form schema by QR UUID.
     * Public endpoint (no auth required)
     */
    public function getAgendaByUuid(string $uuid_qr)
    {
        $agenda = Agenda::where('uuid_qr', $uuid_qr)->with('templateAbsensi')->firstOrFail();

        if ($agenda->status !== 'aktif') {
            return response()->json([
                'message' => 'Agenda ini belum dibuka atau sudah ditutup.'
            ], 403);
        }

        return response()->json([
            'id' => $agenda->id,
            'judul' => $agenda->judul,
            'deskripsi' => $agenda->deskripsi,
            'tanggal_mulai' => $agenda->tanggal_mulai,
            'lokasi' => $agenda->lokasi,
            'is_publik' => $agenda->is_publik,
            'schema' => $agenda->templateAbsensi ? $agenda->templateAbsensi->skema_kolom : [],
        ]);
    }

    /**
     * Submit absensi from public QR scan.
     * Public endpoint (no auth required)
     */
    public function submitAbsensi(Request $request, string $uuid_qr)
    {
        $agenda = Agenda::where('uuid_qr', $uuid_qr)->with('templateAbsensi')->firstOrFail();

        if ($agenda->status !== 'aktif') {
            return response()->json([
                'message' => 'Absensi tidak dapat disimpan karena agenda tidak aktif.'
            ], 403);
        }

        $schema = $agenda->templateAbsensi ? $agenda->templateAbsensi->skema_kolom : [];
        $dataKehadiran = $request->input('data_kehadiran', []);

        // Validate data_kehadiran matches schema requirement
        $validationRules = [];
        foreach ($schema as $field) {
            $fieldName = $field['name'];
            $rules = [];
            
            if ($field['required']) {
                $rules[] = 'required';
            } else {
                $rules[] = 'nullable';
            }

            if ($field['type'] === 'number') {
                $rules[] = 'numeric';
            } else {
                $rules[] = 'string';
            }

            $validationRules["data_kehadiran.{$fieldName}"] = $rules;
        }

        $request->validate($validationRules);

        // Save absensi
        $absensi = Absensi::create([
            'agenda_id' => $agenda->id,
            'data_kehadiran' => $dataKehadiran,
            'waktu_hadir' => Carbon::now(),
            'ditambahkan_oleh' => null,
        ]);

        return response()->json([
            'message' => 'Kehadiran Anda berhasil dicatat.',
            'absensi' => $absensi
        ], 210);
    }

    /**
     * Get attendance records for a specific agenda.
     * Protected endpoint (requires auth)
     */
    public function indexPrivate(string $agendaId)
    {
        $agenda = Agenda::findOrFail($agendaId);
        $absensis = Absensi::where('agenda_id', $agenda->id)
            ->with('operator')
            ->orderBy('waktu_hadir', 'desc')
            ->get();

        return response()->json($absensis);
    }

    /**
     * Save manually inputted absensi by Admin/Secretary.
     * Protected endpoint (requires auth)
     */
    public function storeManual(Request $request, string $agendaId)
    {
        $agenda = Agenda::findOrFail($agendaId);
        
        $request->validate([
            'data_kehadiran' => 'required|array',
        ]);

        $absensi = Absensi::create([
            'agenda_id' => $agenda->id,
            'data_kehadiran' => $request->data_kehadiran,
            'waktu_hadir' => Carbon::now(),
            'ditambahkan_oleh' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Kehadiran berhasil ditambahkan manual.',
            'absensi' => $absensi->load('operator')
        ], 210);
    }

    /**
     * Export attendance rekap to CSV.
     * Protected endpoint (requires auth)
     */
    public function exportCsv(string $agendaId)
    {
        $agenda = Agenda::with('templateAbsensi')->findOrFail($agendaId);
        $absensis = Absensi::where('agenda_id', $agenda->id)->orderBy('waktu_hadir', 'asc')->get();

        $schema = $agenda->templateAbsensi ? $agenda->templateAbsensi->skema_kolom : [];
        
        // Define Headers
        $headers = [];
        foreach ($schema as $field) {
            $headers[] = $field['label'];
        }
        $headers[] = 'Waktu Hadir';
        $headers[] = 'Metode';

        $callback = function() use ($absensis, $headers, $schema) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $headers);

            foreach ($absensis as $row) {
                $line = [];
                $data = $row->data_kehadiran;
                
                foreach ($schema as $field) {
                    $fieldName = $field['name'];
                    $line[] = isset($data[$fieldName]) ? $data[$fieldName] : '';
                }
                
                $line[] = $row->waktu_hadir->toDateTimeString();
                $line[] = $row->ditambahkan_oleh ? 'Manual' : 'Mandiri';
                
                fputcsv($file, $line);
            }
            fclose($file);
        };

        $filename = 'rekap_absensi_' . Str::slug($agenda->judul) . '_' . date('Ymd_His') . '.csv';

        return response()->stream($callback, 200, [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename={$filename}",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ]);
    }
}
