<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PeriodeController;
use App\Http\Controllers\Api\StrukturController;
use App\Http\Controllers\Api\AgendaController;
use App\Http\Controllers\Api\TemplateAbsensiController;
use App\Http\Controllers\Api\AbsensiPublikController;
use App\Http\Controllers\Api\SuratController;
use App\Http\Controllers\Api\DokumentasiController;
use App\Http\Controllers\Api\KeuanganController;
use App\Http\Controllers\Api\LaporanController;
use App\Models\Role;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/agenda/{uuid_qr}', [AbsensiPublikController::class, 'getAgendaByUuid']);
Route::post('/public/agenda/{uuid_qr}/absen', [AbsensiPublikController::class, 'submitAbsensi']);
Route::get('/public/verifikasi-surat/{uuid_verifikasi}', [SuratController::class, 'verifikasiSurat']);

// Protected routes (requires Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Agenda & Absensi Management Routes (Read-Write for specific roles)
    Route::apiResource('/agendas', AgendaController::class);
    Route::apiResource('/template-absensis', TemplateAbsensiController::class);
    Route::get('/agendas/{id}/qr', [AgendaController::class, 'qr']);
    Route::get('/agendas/{id}/absensi', [AbsensiPublikController::class, 'indexPrivate']);
    Route::post('/agendas/{id}/absensi/manual', [AbsensiPublikController::class, 'storeManual']);
    Route::get('/agendas/{id}/absensi/export', [AbsensiPublikController::class, 'exportCsv']);

    // Dokumentasi Kegiatan Routes
    Route::get('/agendas/{id}/dokumentasi', [DokumentasiController::class, 'index']);
    Route::post('/agendas/{id}/dokumentasi', [DokumentasiController::class, 'store']);
    Route::delete('/dokumentasi/{id}', [DokumentasiController::class, 'destroy']);

    // Keuangan (Finance & OCR) Routes
    Route::get('/keuangan/struk', [KeuanganController::class, 'index']);
    Route::post('/keuangan/struk', [KeuanganController::class, 'store']);
    Route::put('/keuangan/struk/{id}', [KeuanganController::class, 'update']);
    Route::delete('/keuangan/struk/{id}', [KeuanganController::class, 'destroy']);
    Route::get('/keuangan/summary', [KeuanganController::class, 'summary']);
    Route::get('/keuangan/export-pdf', [KeuanganController::class, 'exportPdf']);

    // Surat-Menyurat (Mail Management) Routes
    Route::get('/surat/templates', [SuratController::class, 'indexTemplate']);
    Route::post('/surat/templates', [SuratController::class, 'storeTemplate']);
    Route::get('/surat/templates/{id}', [SuratController::class, 'showTemplate']);
    Route::put('/surat/templates/{id}', [SuratController::class, 'updateTemplate']);
    Route::delete('/surat/templates/{id}', [SuratController::class, 'destroyTemplate']);
    
    Route::get('/surat/keluar', [SuratController::class, 'indexSuratKeluar']);
    Route::post('/surat/generate', [SuratController::class, 'generateSurat']);
    
    Route::get('/surat/masuk', [SuratController::class, 'indexSuratMasuk']);
    Route::post('/surat/masuk', [SuratController::class, 'storeSuratMasuk']);
    Route::post('/surat/masuk/{id}', [SuratController::class, 'updateSuratMasuk']);
    Route::delete('/surat/masuk/{id}', [SuratController::class, 'destroySuratMasuk']);

    // Laporan Bulanan Routes
    Route::get('/laporan', [LaporanController::class, 'index']);
    Route::post('/laporan/preview', [LaporanController::class, 'preview']);
    Route::post('/laporan/generate', [LaporanController::class, 'store']);
    Route::delete('/laporan/{id}', [LaporanController::class, 'destroy']);

    // Superadmin specific routes
    Route::middleware('role:Superadmin')->group(function () {
        Route::apiResource('/users', UserController::class);
        Route::apiResource('/periodes', PeriodeController::class);
        Route::apiResource('/strukturs', StrukturController::class);
        
        // Helper route to get all roles for user management dropdown
        Route::get('/roles', function () {
            return response()->json(Role::all());
        });
    });
});
