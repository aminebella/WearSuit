<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SuitController;
use App\Http\Controllers\API\RentalController;
use App\Http\Controllers\API\AdminUserController;
use App\Http\Controllers\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Admin routes
    Route::middleware(['is_admin'])->group(function () {
        // Suits management
        Route::prefix('admin')->group(function () {
            // List clients for reservation creation
            Route::get('/users', [AdminUserController::class, 'index']);

            // List admin's own suits
            Route::get('/suits', [SuitController::class, 'indexAdmin']);
            
            // Create a new suit
            Route::post('/suits', [SuitController::class, 'store']);
            
            // Update a suit
            Route::put('/suits/{suit}', [SuitController::class, 'update']);
            
            // Delete a suit //x
            Route::delete('/suits/{suit}', [SuitController::class, 'destroy']);
            
            // Upload suit images 
            Route::post('/suits/{suit}/images', [SuitController::class, 'uploadImages']);
            
            // Delete suit image 
            Route::delete('/suits/{suit}/images/{image}', [SuitController::class, 'deleteImage']);
            
            // List admin's rentals (for their suits)
            Route::get('/rentals', [RentalController::class, 'indexAdmin']);
            
            // Create a rental for a client (admin creates reservations)
            Route::post('/rentals', [RentalController::class, 'store']);
            
            // Update a rental
            Route::put('/rentals/{rental}', [RentalController::class, 'update']);
            
            // Delete a rental
            Route::delete('/rentals/{rental}', [RentalController::class, 'destroy']);
        });
    });

    //Client routes
    //Filters
    Route::get('/filters', [SuitController::class, 'getFilters']);
    //List available suits with filters
    Route::get('/suits', [SuitController::class, 'indexClient']);
    
    //View suit details (with admin info for contact)
    Route::get('/suits/{suit}', [SuitController::class, 'show']);

    //View Availability (calendar view)
    Route::get('/suits/{suit}/availability', [SuitController::class, 'getAvailability']);
    
    //Client's rentals (view only)
    Route::get('/my-rentals', [RentalController::class, 'indexClient']);
    
    //View rental details
    Route::get('/rentals/{rental}', [RentalController::class, 'show']);
});

