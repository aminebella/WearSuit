<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Rental;
use Faker\Factory as Faker;

class RentalSeeder extends Seeder
{
    public function run(): void
    {

        Rental::create([
            'user_id' => 2, // éviter admin (id=1)
            'suit_id' => 1,
            'start_date' => "2025-10-10",
            'end_date' => "2025-10-20",
            'return_date' => "2025-10-20",
            'status' => 'completed',
            'notes' => 'very good client , the suit is still looking good , defently rent him again',
            'total_price' => 5000.0,
            'payment_status' => 'paid',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $status = ["active", "completed", "cancelled"];
        $payment_status = ["unpaid", "paid", "refunded"];
        $faker = Faker::create();

        // seeders
        for ($i = 1; $i <= 10; $i++) {
            $start = now()->subDays(rand(1, 10));
            $end = (clone $start)->addDays(rand(1, 15));

            // Récupérer prix
            $suit = DB::table('suits')->find($i);
            $days = $start->diffInDays($end);
            $total = $days * $suit->price_per_day;

            Rental::create([
                'suit_id' => $i,
                'user_id' => rand(2, 6), // éviter admin (id=1)
                'start_date' => $start,
                'end_date' => $end,
                'return_date' => $end,
                'status' => $status[array_rand($status)],
                'notes' => $faker->sentence(12),
                'total_price' => $total,
                'payment_status' => $payment_status[array_rand($payment_status)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Factory
        // Rental::factory(10)->create();
    }
}
