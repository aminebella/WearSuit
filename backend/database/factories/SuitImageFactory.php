<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Suit;

class SuitImageFactory extends Factory
{
    public function definition(): array
    {
        $suitsFolderPath = public_path('suits');
        $suitImages = [
            '\suit1.jpg',
            '\suit2.jpg', 
            '\suit3.jpg',
            '\suit4.jpg',
            '\suit5.jpg',
            '\suit6.jpg',
        ];
        
        return [
            'suit_id' => Suit::factory(),
            'image_path' => $suitsFolderPath.fake()->randomElement($suitImages),
            'sort_order' => fake()->numberBetween(0, 5),
        ];
    }
}
