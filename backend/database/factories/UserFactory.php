<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{

    protected static ?string $password;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),

            'address' => fake()->address,
            'phone' => fake()->e164PhoneNumber,

            'email' => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            // 'remember_token' => Str::random(10),
            'role' => fake()->randomElement(['admin', 'user']),
        ];
    }

}
