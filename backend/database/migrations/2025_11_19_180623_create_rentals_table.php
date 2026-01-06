<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rentals', function (Blueprint $table) {
            $table->id();
            // Admin who creates the reservation
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            // Client
            $table->foreignId("user_id")->constrained()->onDelete("cascade")->onUpdate("cascade");
            $table->foreignId("suit_id")->constrained()->onDelete("cascade")->onUpdate("cascade");
            $table->date("start_date")->default(DB::raw('CURRENT_DATE'));
            // $table->date("end_date")->nullable();
            // $table->date("return_date")->nullable();
            $table->enum("status" ,["active", "completed", "cancelled"]);
            $table->text("notes")->nullable();
            $table->decimal("total_price", 8, 2)->nullable();
            $table->enum('payment_status', ["unpaid", "paid", "refunded"])->default('unpaid');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rentals');
    }
};
