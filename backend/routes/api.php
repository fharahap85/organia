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
use App\Models\Role;

// Public routes
Route::post('/login', [AuthController::class, 'login']);
Route::get('/public/agenda/{uuid_qr}', [AbsensiPublikController::class, 'getAgendaByUuid']);
Route::post('/public/agenda/{uuid_qr}/absen', [AbsensiPublikController::class, 'submitAbsensi']);

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
