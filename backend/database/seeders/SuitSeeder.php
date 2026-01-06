<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Suit;
use App\Models\User;

class SuitSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $this->command->warn('No admin users found. Please run UserSeeder first.');
            return;
        }

        // Create specific suits for each admin
        Suit::create([
            'admin_id' => $admin->id,
            'name' => "Classic Black Tuxedo",
            'description' => "Perfect for formal events and weddings. Elegant and timeless design.",
            'size' => "L",
            'color' => "black",
            'gender' => "men",
            'category' => "formal",
            'price_per_day' => 500,
            'status' => "available",
            'is_active' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Generate additional suits for all admins
        $sizes = ['3XL','2XL','XL','L','M','S','XS'];
        $colors = ['white','black','red','yellow','green','purple','orange','gray'];
        $genders = ['men', 'women', 'girls','boys'];
        $categories = ["wedding", "traditional", "party", "formal", "other"];
        $statuses = ['available', 'unavailable'];

        $admins = User::where('role', 'admin')->get();

        foreach ($admins as $admin) {
            for ($i = 1; $i <= 5; $i++) {
                Suit::create([
                    'admin_id' => $admin->id,
                    'name' => "Premium Suit {$admin->id}-{$i}",
                    'description' => "High-quality suit from {$admin->first_name}'s collection. Perfect for any occasion.",
                    'size' => $sizes[array_rand($sizes)],
                    'color' => $colors[array_rand($colors)],
                    'gender' => $genders[array_rand($genders)],
                    'category' => $categories[array_rand($categories)],
                    'price_per_day' => rand(80, 1000),
                    'status' => $statuses[array_rand($statuses)],
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Generate additional random suits using factory
        Suit::factory(20)->create();
    }
}
