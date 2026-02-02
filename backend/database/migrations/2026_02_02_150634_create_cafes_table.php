<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cafes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('location');
            $table->decimal('rating', 3, 2); // For your critique system (e.g., 4.50)
            $table->text('review');
            $table->string('image_path')->nullable(); // For your photo journal
            $table->decimal('latitude', 10, 8)->nullable(); // For the mapping feature
            $table->decimal('longitude', 11, 8)->nullable();
            $table->integer('likes')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cafes');
    }
};
