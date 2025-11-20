<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Suit;

class SuitSeeder extends Seeder
{

    public function run(): void
    {
        Suit::create([
                'name' => "Suit 1",
                'description' => "Description for suit 1",
                'size' => "L",
                'color' => "black",
                'gender' => "men",
                'category' => "formal",
                'price_per_day' => 500,
                'status' => "available",
                'created_at' => now(),
                'updated_at' => now(),
        ]);

        $sizes = ['S', 'M', 'L', 'XL'];
        $colors = ['white','black','red','yellow','green','purple','orange','gray'];
        $genders = ['men', 'women', 'girls','boys'];
        $categorys = ["wedding", "traditional", "party", "formal", "other"];
        $statuses = ['available', 'unavailable'];


        for ($i = 1; $i <= 10; $i++) {
            $hasActiveRental = DB::table('rentals')->where('suit_id', $i)->where('status', 'active')->exists();
            Suit::create([
                'name' => "Suit $i",
                'description' => "Description for suit $i",
                'size' => $sizes[array_rand($sizes)],
                'color' => $colors[array_rand($colors)],
                'gender' => $genders[array_rand($genders)],
                'category' => $categorys[array_rand($categorys)],
                'price_per_day' => rand(80, 1000),
                'status' => $hasActiveRental ? 'rented' : $statuses[array_rand($statuses)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Suits
        // Suit::factory(10)->create();
    }
}
