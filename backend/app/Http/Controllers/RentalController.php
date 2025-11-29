<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rental;
use App\Models\User;
use App\Models\Suit;

class RentalController extends Controller
{
    /**
     * Display a listing of the rentals.
     */
    public function index()
    {
        // Récupère toutes les locations avec relations user et suit
        $rentals = Rental::with(['user', 'suit'])->get();
        return response()->json($rentals, 200);
    }

    /**
     * Store a newly created rental in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'suit_id' => 'required|integer|exists:suits,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'return_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|string|max:50',
            'notes' => 'nullable|string',
            'total_price' => 'required|numeric|min:0',
            'payment_status' => 'required|string|max:50',
        ]);

        $rental = Rental::create($request->all());

        return response()->json([
            'message' => 'Rental created successfully',
            'data' => $rental
        ], 201);
    }

    /**
     * Display the specified rental.
     */
    public function show(Rental $rental)
    {
        $rental->load(['user', 'suit']);
        return response()->json($rental, 200);
    }

    /**
     * Update the specified rental in storage.
     */
    public function update(Request $request, Rental $rental)
    {
        $request->validate([
            'user_id' => 'sometimes|integer|exists:users,id',
            'suit_id' => 'sometimes|integer|exists:suits,id',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'return_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|string|max:50',
            'notes' => 'nullable|string',
            'total_price' => 'sometimes|numeric|min:0',
            'payment_status' => 'sometimes|string|max:50',
        ]);

        $rental->update($request->all());

        return response()->json([
            'message' => 'Rental updated successfully',
            'data' => $rental
        ], 200);
    }

    /**
     * Remove the specified rental from storage.
     */
    public function destroy(Rental $rental)
    {
        $rental->delete();

        return response()->json([
            'message' => 'Rental deleted successfully'
        ], 200);
    }
}
