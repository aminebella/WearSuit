<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rental;
use App\Models\Suit;
use App\Models\RentalDay;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RentalController extends Controller
{
    /**
     * Display a listing of the resource for admin (rentals they created for their suits).
     *
     * @return \Illuminate\Http\Response
     */
    public function indexAdmin(Request $request)
    {
        $query = Rental::with(['suit', 'user', 'days'])
            ->where('admin_id', Auth::id())
            ->latest();

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('suit_id')) {
            $query->where('suit_id', $request->suit_id);
        }

        if ($request->has('start_date')) {
            $query->whereDate('start_date', '>=', $request->start_date);
        }

        $rentals = $query->paginate(10);

        return response()->json($rentals);
    }

    /**
     * Display a listing of the resource for client (their own rentals).
     *
     * @return \Illuminate\Http\Response
     */
    public function indexClient()
    {
        $rentals = Rental::with(['suit', 'suit.images', 'suit.admin', 'days'])
            ->where('user_id', Auth::id())
            ->latest()
            ->paginate(10);

        // Transform the response to include required fields
        $transformedRentals = $rentals->getCollection()->map(function ($rental) {
            return [
                'id' => $rental->id,
                'status' => $rental->status,
                'total_price' => $rental->total_price,
                'notes' => $rental->notes,
                'start_date' => $rental->start_date,
                'payment_status' => $rental->payment_status,
                'created_at' => $rental->created_at,
                'updated_at' => $rental->updated_at,
                'suit' => [
                    'id' => $rental->suit->id,
                    'name' => $rental->suit->name,
                    'price_per_day' => $rental->suit->price_per_day,
                    'category' => $rental->suit->category,
                    'size' => $rental->suit->size,
                    'gender' => $rental->suit->gender,
                    'color' => $rental->suit->color,
                    'images' => $rental->suit->images->map(function ($image) {
                        return [
                            'id' => $image->id,
                            'image_path' => $image->image_path,
                            'sort_order' => $image->sort_order,
                        ];
                    }),
                    'admin' => [
                        'id' => $rental->suit->admin->id,
                        'name' => $rental->suit->admin->name,
                        'shop_name' => $rental->suit->admin->shop_name,
                        'phone' => $rental->suit->admin->phone,
                        'city' => $rental->suit->admin->city,
                        'address' => $rental->suit->admin->address,
                    ],
                ],
                'days' => $rental->days->map(function ($day) {
                    return [
                        'id' => $day->id,
                        'day' => $day->day,
                        'price' => $day->price,
                    ];
                }),
            ];
        });

        return response()->json([
            'data' => $transformedRentals,
            'pagination' => [
                'current_page' => $rentals->currentPage(),
                'last_page' => $rentals->lastPage(),
                'per_page' => $rentals->perPage(),
                'total' => $rentals->total(),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Only admins can create reservations.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Only admins can create reservations
        if (Auth::user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized. Only admins can create reservations.'], 403);
        }

        $validated = $request->validate([
            'suit_id' => 'required|exists:suits,id',
            'user_id' => 'required|exists:users,id',
            'dates' => 'required|array|min:1',
            'dates.*' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string',
            'payment_status' => 'nullable|in:unpaid,paid,refunded',
        ]);

        $suit = Suit::findOrFail($validated['suit_id']);
        
        // Verify admin owns this suit
        if ($suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'You can only create reservations for your own suits.'], 403);
        }

        // Sort dates and get first/last for rental period
        $dates = collect($validated['dates'])->sort()->values();
        $startDate = $dates->first();
        // $endDate = $dates->last();

        // Check if the suit is available for the selected dates
        $conflicts = $this->checkDateConflicts($suit, $validated['dates']);
        
        if ($conflicts->isNotEmpty()) {
            return response()->json([
                'message' => 'The suit is not available for the selected dates.',
                'conflicts' => $conflicts
            ], 422);
        }

        // Calculate total price dynamically
        $totalPrice = count($validated['dates']) * $suit->price_per_day;

        // Use transaction for data integrity
        $rental = \DB::transaction(function () use ($validated, $suit, $startDate, $totalPrice) {
            // Create the rental
            $rental = Rental::create([
                'suit_id' => $validated['suit_id'],
                'user_id' => $validated['user_id'],
                'admin_id' => Auth::id(),
                'start_date' => $startDate,
                'total_price' => $totalPrice,
                'status' => 'active',
                'notes' => $validated['notes'] ?? null,
                'payment_status' => $validated['payment_status'] ?? 'unpaid',
            ]);

            // Create rental days for each specific date
            $this->createRentalDaysFromDates($rental, $validated['dates']);

            // Update suit status if needed
            // $suit->update(['status' => 'unavailable']);

            return $rental;
        });

        return response()->json([
            'message' => 'Reservation created successfully',
            'rental' => $rental->load(['suit', 'user'])
        ], 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Rental  $rental
     * @return \Illuminate\Http\Response
     */
    public function show(Rental $rental)
    {
        // Check if the authenticated user is the client, admin who created it, or the suit owner
        if ($rental->user_id !== Auth::id() && 
            $rental->admin_id !== Auth::id() && 
            $rental->suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($rental->load(['suit', 'suit.images', 'suit.admin', 'days']));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Rental  $rental
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Rental $rental)
    {
        // Only the admin who created the rental or the admin who owns the suit can update it
        if ($rental->admin_id !== Auth::id() && $rental->suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow updating certain fields
        $validated = $request->validate([
            'status' => 'sometimes|required|in:active,completed,cancelled',
            'notes' => 'nullable|string',
            'payment_status' => 'sometimes|required|in:unpaid,paid,refunded',
        ]);

        // If updating status to cancelled, check if we need to update suit status
        if (isset($validated['status']) && $validated['status'] === 'cancelled') {
            // Check if there are any other active rentals for this suit
            $hasOtherRentals = Rental::where('suit_id', $rental->suit_id)
                ->where('id', '!=', $rental->id)
                ->whereIn('status', ['active'])
                ->exists();

            if (!$hasOtherRentals) {
                $rental->suit->update(['status' => 'available']);
            }
        }

        $rental->update($validated);

        return response()->json($rental->load(['suit', 'user']));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Rental  $rental
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rental $rental)
    {
        // Only the admin who created the rental or the admin who owns the suit can delete it
        if ($rental->admin_id !== Auth::id() && $rental->suit->admin_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if the rental can be deleted (only if it's not completed or already cancelled)
        if (in_array($rental->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'Cannot delete a completed or cancelled rental.'
            ], 422);
        }

        // Update suit status if needed
        $suit = $rental->suit;
        $hasOtherRentals = Rental::where('suit_id', $suit->id)
            ->where('id', '!=', $rental->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if (!$hasOtherRentals) {
            $suit->update(['status' => 'available']);
        }

        // Delete the rental (this will cascade delete the rental days)
        $rental->delete();

        return response()->json(['message' => 'Rental deleted successfully']);
    }

    /**
     * Check if a suit is available for the given dates.
     *
     * @param  \App\Models\Suit  $suit
     * @param  string  $startDate
     * @param  string  $endDate
     * @return bool
     */
    private function isSuitAvailable($suit, $startDate, $endDate)
    {
        // Check if the suit is active and available
        if (!$suit->is_active || $suit->status !== 'available') {
            return false;
        }

        // Check for any overlapping rentals
        $overlappingRental = Rental::where('suit_id', $suit->id)
            ->where(function($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                    ->orWhereBetween('end_date', [$startDate, $endDate])
                    ->orWhere(function($q) use ($startDate, $endDate) {
                        $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                    });
            })
            ->whereIn('status', ['active'])
            ->exists();

        return !$overlappingRental;
    }

    /**
     * Create rental days for each specific date.
     *
     * @param  \App\Models\Rental  $rental
     * @param  array  $dates
     * @return void
     */
    private function createRentalDaysFromDates($rental, $dates)
    {
        $days = [];
        
        foreach ($dates as $date) {
            $days[] = [
                'rental_id' => $rental->id,
                'day' => Carbon::parse($date)->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert all days in a single query for better performance
        RentalDay::insert($days);
    }

    /**
     * Check for date conflicts with existing rentals.
     *
     * @param  \App\Models\Suit  $suit
     * @param  array  $dates
     * @return \Illuminate\Support\Collection
     */
    private function checkDateConflicts($suit, $dates)
    {
        $conflicts = collect();
        
        foreach ($dates as $date) {
            $hasConflict = RentalDay::whereHas('rental', function($query) {
                    $query->whereIn('status', ['active']);
                })
                ->whereHas('rental.suit', function($query) use ($suit) {
                    $query->where('id', $suit->id);
                })
                ->where('day', Carbon::parse($date)->format('Y-m-d'))
                ->exists();
                
            if ($hasConflict) {
                $conflicts->push($date);
            }
        }
        
        return $conflicts;
    }

    /**
     * Create rental days for each day in the rental period.
     *
     * @param  \App\Models\Rental  $rental
     * @param  \Carbon\Carbon  $startDate
     * @param  \Carbon\Carbon  $endDate
     * @return void
     */
    private function createRentalDays($rental, $startDate, $endDate)
    {
        $days = [];
        $period = CarbonPeriod::create($startDate, $endDate);
        
        foreach ($period as $date) {
            $days[] = [
                'rental_id' => $rental->id,
                'day' => $date->format('Y-m-d'),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert all days in a single query for better performance
        RentalDay::insert($days);
    }
}
