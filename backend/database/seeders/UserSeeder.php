<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'shop_name' => 'Elite Suits Boutique',
            'city' => 'Casablanca',
            'address' => '123 Admin Street, Casablanca',
            'phone' => '+212 600102030',
            'email' => 'admin@wearsuit.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // First User
        User::create([
            'first_name' => 'Amine',
            'last_name' => 'Bella',
            'shop_name' => null,
            'city' => 'Rabat',
            'address' => '456 Client Avenue, Rabat',
            'phone' => '+212 620202020',
            'email' => 'amine@wearsuit.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Additional Admins
        for($i = 1; $i <= 3; $i++){
            User::create([
                'first_name' => "Admin$i",
                'last_name' => "Shop$i",
                'shop_name' => "Premium Suits Shop $i",
                'city' => 'Marrakech',
                'address' => "Shop $i Address, Marrakech",
                'phone' => "+212 63030303$i",
                'email' => "admin$i@wearsuit.com",
                'password' => Hash::make('password'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Additional Users
        for($i = 2; $i <= 10; $i++){
            User::create([
                'first_name' => "User$i",
                'last_name' => "Client$i",
                'shop_name' => null,
                'city' => 'Tangier',
                'address' => "Address $i, Tangier",
                'phone' => "+212 64040404$i",
                'email' => "user$i@wearsuit.com",
                'password' => Hash::make('password'),
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Generate additional random users using factory
        User::factory(20)->create();
    }
}
