<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PeriodeController;
use App\Http\Controllers\Api\StrukturController;
use App\Models\Role;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (requires Sanctum token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

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
