<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use \App\Models\Suit;
use \App\Models\User;

class RentalFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-10 days', '-1 days');
        $end = (clone $start)->modify('+' . rand(1, 5) . ' days');

        $suit = Suit::inRandomOrder()->first() ?? \App\Models\Suit::factory()->create();

        $days = (new \Carbon\Carbon($start))->diffInDays(new \Carbon\Carbon($end));
        $total = $days * $suit->price_per_day;

        return [
            'suit_id' => $suit->id,
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'start_date' => $start,
            'end_date' => $end,
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
            'total_price' => $total,
        ];
    }
}
