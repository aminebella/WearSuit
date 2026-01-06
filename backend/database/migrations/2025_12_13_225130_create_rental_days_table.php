<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rental_days', function (Blueprint $table) {
            $table->id();
            $table->foreignId('rental_id')->constrained()->onDelete('cascade');
            $table->date('day');
            $table->timestamps();
            
            // Add unique constraint to prevent duplicate days for the same rental
            $table->unique(['rental_id', 'day']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rental_days');
    }
};
