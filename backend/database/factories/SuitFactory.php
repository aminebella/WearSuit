<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SuitFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => "Suit " . fake()->unique()->numberBetween(1, 100),
            'description' => fake()->sentence(12),
            'size' => fake()->randomElement(['S', 'M', 'L', 'XL']),
            'color' => fake()->randomElement(['white','black','red','yellow','green','purple','orange','gray']),
            'gender' => fake()->randomElement(['men', 'women', 'girls','boys']),
            'category' => fake()->randomElement(["wedding", "traditional", "party", "formal", "other"]),
            'price_per_day' => fake()->numberBetween(80, 1000),
            'status' => fake()->randomElement(['available', 'unavailable', 'rented']),
        ];
    }
}
