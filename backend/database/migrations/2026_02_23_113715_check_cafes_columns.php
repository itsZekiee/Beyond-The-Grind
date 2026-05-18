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
        Schema::table('cafes', function (Blueprint $table) {
            if (!Schema::hasColumn('cafes', 'likes')) {
                $table->integer('likes')->default(0);
            }
            if (!Schema::hasColumn('cafes', 'views')) {
                $table->integer('views')->default(0);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            // No drop in case they were actually there
        });
    }
};
