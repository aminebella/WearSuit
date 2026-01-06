<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class SuitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'admin_id' => User::where('role', 'admin')->inRandomOrder()->first()->id ?? User::factory()->admin()->create(),
            'name' => fake()->words(3, true) . " Suit",
            'description' => fake()->sentence(12),
            'size' => fake()->randomElement(['3XL','2XL','XL','L','M','S','XS']),
            'color' => fake()->randomElement(['white','black','red','yellow','green','purple','orange','gray']),
            'gender' => fake()->randomElement(['men', 'women', 'girls','boys']),
            'category' => fake()->randomElement(["wedding", "traditional", "party", "formal", "other"]),
            'price_per_day' => fake()->numberBetween(80, 1000),
            'status' => fake()->randomElement(['available', 'unavailable']),
            'is_active' => true,
        ];
    }
}
