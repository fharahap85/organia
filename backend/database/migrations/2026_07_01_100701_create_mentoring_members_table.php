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
        Schema::create('mentoring_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mentoring_group_id')->constrained('mentoring_groups')->onDelete('cascade');
            $table->foreignId('kader_id')->constrained('kaders')->onDelete('cascade');
            $table->string('status')->default('aktif');
            $table->timestamps();
            
            // A kader cannot be in the same group twice
            $table->unique(['mentoring_group_id', 'kader_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mentoring_members');
    }
};
