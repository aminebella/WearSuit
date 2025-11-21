<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Suit;
use App\Models\User;

class RentalFactory extends Factory
{
    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-10 days', '-1 days');
        $end = (clone $start)->modify('+' . rand(1, 5) . ' days');

        $suit = Suit::inRandomOrder()->first() ?? Suit::factory()->create();

        $days = (new \Carbon\Carbon($start))->diffInDays(new \Carbon\Carbon($end));
        $total = $days * $suit->price_per_day;

        $payment_status = ["unpaid", "paid", "refunded"];

        return [
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'suit_id' => $suit->id,
            'start_date' => $start,
            'end_date' => $end,
            'return_date' => $end,
            'status' => fake()->randomElement(['active', 'completed', 'cancelled']),
            'notes' => 'very good client , the suit is still looking good , defently rent him again',
            'total_price' => $total,
            'payment_status' => $payment_status[array_rand($payment_status)],
        ];
    }
}
