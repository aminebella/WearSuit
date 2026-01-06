<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\RentalDay;
use App\Models\Rental;

class RentalDaySeeder extends Seeder
{
    public function run(): void
    {
        $rentals = Rental::all();
        
        if ($rentals->isEmpty()) {
            $this->command->warn('No rentals found. Please run RentalSeeder first.');
            return;
        }

        // Create rental days for each rental
        foreach ($rentals as $rental) {
            $start = new \Carbon\Carbon($rental->start_date);
            
            // Generate random number of days (1-5 days) for each rental
            $numDays = rand(1, 5);
            
            for ($i = 0; $i < $numDays; $i++) {
                $currentDay = $start->copy()->addDays($i);
                
                // Check if this rental day already exists to avoid duplicates
                $existingDay = RentalDay::where('rental_id', $rental->id)
                    ->where('day', $currentDay->format('Y-m-d'))
                    ->first();
                
                if (!$existingDay) {
                    RentalDay::create([
                        'rental_id' => $rental->id,
                        'day' => $currentDay->format('Y-m-d'),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // Generate additional rental days using factory with unique rentals
        RentalDay::factory(20)->create();
    }
}
