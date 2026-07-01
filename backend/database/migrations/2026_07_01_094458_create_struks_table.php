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
        Schema::create('struks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agenda_id')->constrained('agendas')->onDelete('cascade');
            $table->string('file_gambar_path');
            $table->bigInteger('nominal')->default(0);
            $table->date('tanggal_transaksi')->nullable();
            $table->string('nama_vendor')->nullable();
            $table->string('status_verifikasi')->default('pending'); // pending, verified, rejected
            $table->longText('ocr_raw_text')->nullable();
            $table->jsonb('low_confidence_flags')->nullable(); // JSON keys of fields with low confidence
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
        Schema::dropIfExists('struks');
    }
};
