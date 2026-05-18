<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            $table->string('title')->nullable()->after('id');
            $table->enum('type', ['Cafe', 'Restaurant'])->default('Cafe')->after('name');
            $table->boolean('is_published')->default(false)->after('likes');
            $table->json('tags')->nullable()->after('is_published');
        });
    }

    public function down(): void
    {
        Schema::table('cafes', function (Blueprint $table) {
            $table->dropColumn(['title', 'type', 'is_published', 'tags']);
        });
    }
};
