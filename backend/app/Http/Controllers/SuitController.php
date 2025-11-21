<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Suit;

class SuitController extends Controller
{
    /**
     * Display a listing of the suits.
     */
    public function index()
    {
        $suits = Suit::with("images")->get();
        return response()->json($suits);
        // return response()->json(["message" => "List of suits"]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(['message' => 'Display suit creation form (optional for API)']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'size' => 'required|string|in:XS,S,M,L,XL,2XL,3XL',
            'color' => 'required|string|max:30',
            'gender' => 'required|string|in:men,women,girls,boys',
            'category' => 'required|in:wedding,traditional,party,formal,other',
            'price_per_day' => 'required|numeric|min:0',
            'status' => 'required|in:available,unavailable,rented',
        ]);

        $suit = Suit::create($request->all());

        return response()->json([
            'message' => 'Suit created successfully',
            'suit' => $suit
        ], 201);
        // return response()->json(["message" => "Suit stored."]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $suit = Suit::with('images')->find($id);
        if (!$suit) {
            return response()->json(['message' => 'Suit not found'], 404);
        }
        return response()->json($suit);
        // return response()->json(["message" => "Suit detail: $id"]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $suit = Suit::find($id);
        if (!$suit) {
            return response()->json(['message' => 'Suit not found'], 404);
        }
        return response()->json($suit);
        // return response()->json(["message" => "Suit edited: $id"]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $suit = Suit::find($id);
        if (!$suit) {
            return response()->json(['message' => 'Suit not found'], 404);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'size' => 'sometimes|required|in:XS,S,M,L,XL,2XL,3XL',
            'color' => 'sometimes|required|string|max:30',
            'gender' => 'sometimes|required|in:men,women,girls,boys',
            'category' => 'sometimes|required|in:wedding,traditional,party,formal,other',
            'price_per_day' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:available,unavailable,rented',
        ]);

        $suit->update($request->all());

        return response()->json([
            'message' => 'Suit updated successfully',
            'suit' => $suit
        ]);
        // return response()->json(["message" => "Suit updated: $id"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $suit = Suit::find($id);
        if (!$suit) {
            return response()->json(['message' => 'Suit not found'], 404);
        }

        $suit->delete();

        return response()->json(['message' => 'Suit deleted successfully']);
        // return response()->json(["message" => "Suit deleted: $id"]);
    }
}
