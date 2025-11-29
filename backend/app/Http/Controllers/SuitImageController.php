<?php

namespace App\Http\Controllers;

use App\Models\SuitImage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SuitImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id)
    {
        // Vérifie que le costume existe
        $suit = Suit::findOrFail($id);

        // Validation
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // max 5MB
            'sort_order' => 'nullable|integer',
        ]);

        // Upload de l'image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('suits', 'public'); // stockage dans storage/app/public/suits
        } else {
            return response()->json(['message' => 'No image uploaded'], 400);
        }

        // Création de l'enregistrement
        $image = SuitImage::create([
            'suit_id' => $suit->id,
            'image_path' => $path, // chemin relatif
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return response()->json([
            'message' => "Image added to suit {$suit->id}",
            'data' => $image,
            'url' => asset("storage/$path") // URL publique
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SuitImage $suitImage)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SuitImage $suitImage)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SuitImage $suitImage)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SuitImage $suitImage)
    {
        //
    }
}
