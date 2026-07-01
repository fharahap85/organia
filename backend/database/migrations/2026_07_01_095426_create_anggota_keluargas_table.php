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
        Schema::create('anggota_keluargas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kader_id')->constrained('kaders')->onDelete('cascade');
            $table->string('tipe_hubungan'); // pasangan, anak
            $table->string('nama');
            $table->text('tanggal_lahir')->nullable(); // encrypted tanggal lahir
            $table->string('jenis_kelamin', 2)->nullable(); // L, P
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('anggota_keluargas');
    }
};
