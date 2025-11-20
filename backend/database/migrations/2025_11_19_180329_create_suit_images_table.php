<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('suit_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId("suit_id")->constrained()->onDelete("cascade")->onUpdate("cascade");
            $table->string("image_path", 255);
            $table->integer("sort_order")->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('suit_images');
    }
};
