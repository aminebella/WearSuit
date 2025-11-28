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
     * Display a listing of the resource.
     */
    public function index()
    {
        $rentals = Rental::with(["user","suit"])->get(); // return list

        return response()->json($rentals, 200); // OR return ["rentals"=>$rentals]
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return response()->json(["message" => "Rental created"]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return response()->json(["message" => "Rental stored"]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return response()->json(["message" => "Rental detail: $id"]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return response()->json(["message" => "Rental edited: $id"]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return response()->json(["message" => "Rental updated: $id"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json(["message" => "Rental deleted: $id"]);
    }
}
