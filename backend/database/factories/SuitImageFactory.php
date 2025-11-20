<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use \App\Models\Suit;

class SuitImageFactory extends Factory
{

    public function definition(): array
    {
        $path_asstes= "C:/Users/Admin/Documents/DevWork/EMSI/4thYear/DevMobile/Project/Devloppement/earSuit/backend/public/assets/";
        
        return [
            'suit_id' => Suit::factory(),
            'image_path' => $path_asstes . fake()->randomElement([
                'suit1.jpg', 'suit2.jpg', 'suit3.jpg', 'suit4.jpg'
            ]),
            'sort_order' => fake()->numberBetween(0, 3),
        ];
    }
}
