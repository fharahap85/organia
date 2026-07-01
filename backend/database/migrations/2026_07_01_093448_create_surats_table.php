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
        Schema::create('surats', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->date('tanggal_surat');
            $table->string('jenis_surat');
            $table->foreignId('template_id')->constrained('template_surats')->onDelete('restrict');
            $table->string('penerima_nama');
            $table->jsonb('penerima_data_json'); // All placeholder values used to generate this letter
            $table->boolean('status_ttd')->default(false); // true if signed digitally
            $table->string('file_pdf_path')->nullable();
            $table->uuid('uuid_verifikasi')->unique();
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
        Schema::dropIfExists('surats');
    }
};
