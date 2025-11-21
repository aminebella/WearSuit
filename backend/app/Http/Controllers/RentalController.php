<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RentalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(["message" => "List of rentals"]);
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
