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
        Schema::create('surat_masuks', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->date('tanggal_terima');
            $table->string('pengirim');
            $table->string('perihal');
            $table->string('file_lampiran_path')->nullable();
            $table->string('status_tindak_lanjut')->default('pending'); // pending, diproses, selesai
            $table->string('disposisi_ke_bidang')->nullable(); // Sekretaris, BIPEKA, Kaderisasi, dll
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('surat_masuks');
    }
};
