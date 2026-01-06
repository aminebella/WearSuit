<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Suit;

class RentalFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-10 days', '-1 days');

        $suit = Suit::inRandomOrder()->first() ?? Suit::factory()->create();
        $admin = User::where('role', 'admin')->inRandomOrder()->first() ?? User::factory()->admin()->create();
        $client = User::where('role', 'user')->inRandomOrder()->first() ?? User::factory()->user()->create();

        $days = rand(1, 5);
        $total = $days * $suit->price_per_day;

        return [
            'admin_id' => $admin->id,
            'user_id' => $client->id,
            'suit_id' => $suit->id,
            'start_date' => $start,
            'total_price' => $total,
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
            'payment_status' => fake()->randomElement(['unpaid', 'paid', 'refunded']),
            'notes' => fake()->sentence(10),
        ];
    }
}
