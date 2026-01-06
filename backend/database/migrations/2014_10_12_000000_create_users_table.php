<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);

            // Shop-related (only meaningful for admins)
            $table->string('shop_name', 150)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('address' ,255)->nullable();
            
            $table->string('phone',20)->unique();
            $table->string('email',255)->unique();
            $table->string('password',255);

            $table->enum("role", ["admin","user"])->default("user");

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
