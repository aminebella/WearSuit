<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Rental;
use App\Models\User;
use App\Models\Suit;
use Faker\Factory as Faker;

class RentalSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $client = User::where('role', 'user')->first();
        $suit = Suit::first();

        if (!$admin || !$client || !$suit) {
            $this->command->warn('Missing required data. Please run UserSeeder and SuitSeeder first.');
            return;
        }

        // Create a specific rental
        $start = now()->subDays(10);
        $days = 5; // 5 days rental
        $totalPrice = $days * $suit->price_per_day;

        Rental::create([
            'admin_id' => $admin->id,
            'user_id' => $client->id,
            'suit_id' => $suit->id,
            'start_date' => $start,
            'total_price' => $totalPrice,
            'status' => 'completed',
            'notes' => 'Excellent client, suit returned in perfect condition.',
            'payment_status' => 'paid',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Generate additional rentals
        $statuses = ['active', 'completed', 'cancelled'];
        $payment_statuses = ['unpaid', 'paid', 'refunded'];
        $faker = Faker::create();

        $suits = Suit::where('is_active', true)->get();
        $clients = User::where('role', 'user')->get();
        $admins = User::where('role', 'admin')->get();

        for ($i = 1; $i <= 15; $i++) {
            $start = now()->subDays(rand(1, 20));
            
            $selectedSuit = $suits->random();
            $selectedClient = $clients->random();
            $selectedAdmin = $admins->random();

            $days = rand(1, 10);
            $total = $days * $selectedSuit->price_per_day;

            Rental::create([
                'admin_id' => $selectedAdmin->id,
                'user_id' => $selectedClient->id,
                'suit_id' => $selectedSuit->id,
                'start_date' => $start,
                'total_price' => $total,
                'status' => $statuses[array_rand($statuses)],
                'payment_status' => $payment_statuses[array_rand($payment_statuses)],
                'notes' => $faker->sentence(12),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Generate additional random rentals using factory
        Rental::factory(25)->create();
    }
}
