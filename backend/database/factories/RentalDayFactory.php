<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Rental;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RentalDay>
 */
class RentalDayFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Create a new rental first to avoid conflicts
        $rental = Rental::factory()->create();
        $start = new \Carbon\Carbon($rental->start_date);
        $end = $start->copy()->addDays(rand(1, 5)); // Create rental period
        $randomDay = fake()->dateTimeBetween($start, $end);

        return [
            'rental_id' => $rental->id,
            'day' => $randomDay->format('Y-m-d'),
        ];
    }
}
