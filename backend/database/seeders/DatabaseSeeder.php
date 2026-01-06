<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\SuitSeeder;
use Database\Seeders\SuitImageSeeder;
use Database\Seeders\RentalSeeder;
use Database\Seeders\RentalDaySeeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            SuitSeeder::class,
            SuitImageSeeder::class,
            RentalSeeder::class,
            RentalDaySeeder::class,
        ]);
    }
}
