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
            'last_name' => 'Admin',
            'address' => 'Admin',
            'phone' => '+212 600102030',
            'email' => 'Admin@Admin.com',
            'password' => Hash::make('Admin'),
            'role' => 'admin',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // First User
        User::create([
            'first_name' => 'Amine',
            'last_name' => 'Amine',
            'address' => 'Azli',
            'phone' => '+212 620202020',
            'email' => 'Amine@Amine.com',
            'password' => Hash::make('Amine'),
            'role' => 'user',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        for($i = 1; $i <= 5; $i++){
        User::create([
                'first_name' => "User$i",
                'last_name' => "Client$i",
                'address' => "Address$i",
                'phone' => "+212 62020202$i",
                'email' => "user$i@gmail.com",
                'password' => Hash::make('user'),
                'role' => 'user',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Users
        // User::factory(10)->create();
    }
}
