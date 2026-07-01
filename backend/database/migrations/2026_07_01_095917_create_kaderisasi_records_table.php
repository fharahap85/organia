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
        Schema::create('kaderisasi_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kader_id')->constrained('kaders')->onDelete('cascade');
            $table->string('jenjang'); // MAPABA, PKD, PKL, dll
            $table->integer('tahun_lulus');
            $table->string('predikat')->nullable();
            $table->string('sertifikat_file')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kaderisasi_records');
    }
};
