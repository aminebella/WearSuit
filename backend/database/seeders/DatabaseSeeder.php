<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\SuitSeeder;
use Database\Seeders\SuitImageSeeder;
use Database\Seeders\RentalSeeder;


class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SuitSeeder::class,
            SuitImageSeeder::class,
            RentalSeeder::class,
        ]);

        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
