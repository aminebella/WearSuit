<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suits', function (Blueprint $table) {
            $table->id();
            $table->string("name", 255);
            $table->text("description")->nullable();
            $table->enum("size" ,["3XL","2XL","XL","L","M","S","XS"]);
            $table->string("color", 30);
            $table->enum("gender" , ["men", "women", "girls","boys"]);
            $table->enum("category", ["wedding", "traditional", "party", "formal", "other"])->default("other");
            $table->decimal("price_per_day", 8, 2);
            $table->enum("status", ["available", "unavailable", "rented"])->default("available");
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suits');
    }
};
