<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Suit;
use App\Models\SuitImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class SuitController extends Controller
{
    /**
     * Display a listing of the resource for admin (only their own suits).
     *
     * @return \Illuminate\Http\Response
     */
    public function indexAdmin()
    {
        $suits = Suit::where('admin_id', Auth::id())
            ->with('images')
            ->latest()
            ->get();

        return response()->json($suits);
    }

    /**
     * Display a listing of active suits for clients.
     *
     * @return \Illuminate\Http\Response
     */
    public function indexClient(Request $request)
    {
        $query = Suit::with(['images', 'admin'])
            ->where('is_active', true)
            ->where('status', 'available');

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('size')) {
            $query->where('size', $request->size);
        }

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('city')) {
            $query->whereHas('admin', function($q) use ($request) {
                $q->where('city', $request->city);
            });
        }

        if ($request->has('min_price')) {
            $query->where('price_per_day', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price_per_day', '<=', $request->max_price);
        }

        $suits = $query->latest()->paginate(10);

        return response()->json($suits);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'size' => 'required|string|max:50',
            'color' => 'required|string|max:100',
            'gender' => 'required|in:male,female,unisex',
            'category' => 'required|string|max:100',
            'price_per_day' => 'required|numeric|min:0',
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Create the suit
        $suit = Suit::create([
            'admin_id' => Auth::id(),
            'name' => $validated['name'],
            'description' => $validated['description'],
            'size' => $validated['size'],
            'color' => $validated['color'],
            'gender' => $validated['gender'],
            'category' => $validated['category'],
            'price_per_day' => $validated['price_per_day'],
            'status' => 'available',
            'is_active' => true,
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('suits/' . $suit->id, 'public');
                $suit->images()->create([
                    'image_path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json($suit->load('images'), 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Suit  $suit
     * @return \Illuminate\Http\Response
     */
    public function show(Suit $suit)
    {
        // Check if the suit is active or if the authenticated user is the admin
        if (!$suit->is_active && $suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Suit not found'], 404);
        }

        return response()->json($suit->load(['images', 'admin']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Suit  $suit
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Suit $suit)
    {
        // Check if the authenticated user is the admin of this suit
        if ($suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'size' => 'sometimes|required|string|max:50',
            'color' => 'sometimes|required|string|max:100',
            'gender' => 'sometimes|required|in:male,female,unisex',
            'category' => 'sometimes|required|string|max:100',
            'price_per_day' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:available,unavailable',
            'is_active' => 'sometimes|boolean',
        ]);

        $suit->update($validated);

        return response()->json($suit->load('images'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Suit  $suit
     * @return \Illuminate\Http\Response
     */
    public function destroy(Suit $suit)
    {
        // Check if the authenticated user is the admin of this suit
        if ($suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if the suit has any active rentals
        if ($suit->rentals()->whereIn('status', ['pending', 'confirmed'])->exists()) {
            return response()->json([
                'message' => 'Cannot delete suit with active or pending rentals'
            ], 422);
        }

        // Delete images from storage
        foreach ($suit->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        // Delete the suit (this will cascade delete the images from the database)
        $suit->delete();

        return response()->json(['message' => 'Suit deleted successfully']);
    }

    /**
     * Upload additional images for a suit.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Suit  $suit
     * @return \Illuminate\Http\Response
     */
    public function uploadImages(Request $request, Suit $suit)
    {
        // Check if the authenticated user is the admin of this suit
        if ($suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'images' => 'required|array|min:1',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $uploadedImages = [];
        $currentMaxOrder = $suit->images()->max('sort_order') ?? -1;

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('suits/' . $suit->id, 'public');
                $uploadedImages[] = $suit->images()->create([
                    'image_path' => $path,
                    'sort_order' => ++$currentMaxOrder,
                ]);
            }
        }

        return response()->json($uploadedImages, 201);
    }

    /**
     * Delete a suit image.
     *
     * @param  \App\Models\Suit  $suit
     * @param  \App\Models\SuitImage  $image
     * @return \Illuminate\Http\Response
     */
    public function deleteImage(Suit $suit, SuitImage $image)
    {
        // Check if the authenticated user is the admin of this suit
        if ($suit->admin_id !== Auth::id() || $image->suit_id !== $suit->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete the image file
        Storage::disk('public')->delete($image->image_path);

        // Delete the image record
        $image->delete();

        return response()->json(['message' => 'Image deleted successfully']);
    }

    /**
     * Get available filters for suits
     * 
     * @return \Illuminate\Http\Response
     */
    /**
     * Get availability of a suit for a calendar view
     *
     * @param  \App\Models\Suit  $suit
     * @param  string  $startDate  Start date in YYYY-MM-DD format
     * @param  string  $endDate    End date in YYYY-MM-DD format
     * @return \Illuminate\Http\Response
     */
    // public function getAvailability(Suit $suit, Request $request)
    // {
    //     $request->validate([
    //         'start_date' => 'required|date|after_or_equal:today',
    //         'end_date' => 'required|date|after_or_equal:start_date',
    //     ]);

    //     $startDate = Carbon::parse($request->start_date);
    //     $endDate = Carbon::parse($request->end_date);
        
    //     // Get all rentals for this suit that overlap with the date range
    //     $rentals = Rental::where('suit_id', $suit->id)
    //         ->whereIn('status', ['pending', 'confirmed'])
    //         ->where(function($query) use ($startDate, $endDate) {
    //             $query->whereBetween('start_date', [$startDate, $endDate])
    //                 ->orWhereBetween('end_date', [$startDate, $endDate])
    //                 ->orWhere(function($q) use ($startDate, $endDate) {
    //                     $q->where('start_date', '<=', $startDate)
    //                         ->where('end_date', '>=', $endDate);
    //                 });
    //         })
    //         ->get();

    //     // Generate calendar data
    //     $calendar = [];
    //     $currentDate = $startDate->copy();
        
    //     while ($currentDate->lte($endDate)) {
    //         $isAvailable = true;
    //         $rentalId = null;
    //         $rentalStatus = null;
            
    //         foreach ($rentals as $rental) {
    //             $rentalStart = Carbon::parse($rental->start_date);
    //             $rentalEnd = Carbon::parse($rental->end_date);
                
    //             if ($currentDate->between($rentalStart, $rentalEnd)) {
    //                 $isAvailable = false;
    //                 $rentalId = $rental->id;
    //                 $rentalStatus = $rental->status;
    //                 break;
    //             }
    //         }
            
    //         $calendar[] = [
    //             'date' => $currentDate->format('Y-m-d'),
    //             'is_available' => $isAvailable,
    //             'rental_id' => $rentalId,
    //             'rental_status' => $rentalStatus,
    //         ];
            
    //         $currentDate->addDay();
    //     }

    //     return response()->json([
    //         'suit_id' => $suit->id,
    //         'suit_name' => $suit->name,
    //         'price_per_day' => $suit->price_per_day,
    //         'availability' => $calendar,
    //         'admin_contact' => [
    //             'shop_name' => $suit->admin->shop_name,
    //             'phone' => $suit->admin->phone,
    //             'email' => $suit->admin->email,
    //             'address' => $suit->admin->address,
    //             'city' => $suit->admin->city,
    //         ]
    //     ]);
    // }


    public function getAvailability(Suit $suit)
    {
        // Get all active rental days for this suit
        $unavailableDays = \App\Models\RentalDay::whereHas('rental', function($query) {
                $query->whereIn('status', ['pending', 'confirmed']);
            })
            ->whereHas('rental.suit', function($query) use ($suit) {
                $query->where('id', $suit->id);
            })
            ->pluck('day')
            ->map(function($date) {
                return \Carbon\Carbon::parse($date)->format('Y-m-d');
            })
            ->unique()
            ->values()
            ->toArray();

        return response()->json([
            'suit_id' => $suit->id,
            'unavailable_days' => $unavailableDays
        ]);
    }

    /**
     * Get available filters for suits
     * 
     * @return \Illuminate\Http\Response
     */
    public function getFilters()
    {
        $filters = [
            'categories' => Suit::where('is_active', true)
                ->distinct()
                ->pluck('category'),
            'sizes' => Suit::where('is_active', true)
                ->distinct()
                ->pluck('size'),
            'genders' => ['male', 'female', 'unisex'],
            'cities' => \App\Models\User::whereHas('suits')
                ->distinct()
                ->pluck('city'),
            'price_range' => [
                'min' => Suit::where('is_active', true)->min('price_per_day') ?? 0,
                'max' => Suit::where('is_active', true)->max('price_per_day') ?? 1000,
            ]
        ];

        return response()->json($filters);
    }
}
