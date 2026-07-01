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
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agenda_id')->constrained('agendas')->onDelete('cascade');
            $table->jsonb('data_kehadiran'); // Stores custom fields values e.g. {nama: 'Fikri', jabatan: 'Kader'}
            $table->dateTime('waktu_hadir');
            $table->unsignedBigInteger('ditambahkan_oleh')->nullable(); // nullable if filled by participant via QR
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
