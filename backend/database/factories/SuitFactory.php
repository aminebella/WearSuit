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
            'price_per_day' => fake()->numberBetween(50, 200),
            'status' => fake()->randomElement(['available', 'unavailable', 'rented']),
        ];
    }
}
