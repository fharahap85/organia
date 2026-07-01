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
        Schema::create('kader_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kader_id')->constrained('kaders')->onDelete('cascade');
            $table->integer('kepemimpinan')->default(0);
            $table->integer('loyalitas')->default(0);
            $table->integer('komunikasi')->default(0);
            $table->integer('kreativitas')->default(0);
            $table->text('catatan')->nullable();
            $table->foreignId('rated_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kader_ratings');
    }
};
