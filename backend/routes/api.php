<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SuitController;
use App\Http\Controllers\SuitImageController;
use App\Http\Controllers\RentalController;

Route::post('/register', [AuthController::class, 'register']);   // open to public
Route::post('/login', [AuthController::class, 'login']);         // open to public

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Admin-only routes
    Route::middleware('is_admin')->group(function () {

        // Create a user manually (admin creates accounts for clients)
        // Route::post('/users', [UserController::class, 'store']);

        Route::resource('/suits', SuitController::class);
        Route::post('/suits/{id}/images', [SuitImageController::class, 'store']);

        Route::resource('/rentals', RentalController::class);
    });

    // Accessible by admin + normal users
    Route::get('/suits', [SuitController::class, 'index']);
    Route::get('/suit/{id}', [SuitController::class, 'show']);

    // logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
