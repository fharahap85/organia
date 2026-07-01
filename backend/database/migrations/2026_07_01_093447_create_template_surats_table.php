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
        Schema::create('template_surats', function (Blueprint $table) {
            $table->id();
            $table->string('judul_template');
            $table->string('jenis_surat'); // Keputusan, Undangan, Pengantar, dll
            $table->longText('konten_html'); // HTML content with placeholders like {{nama}}, {{tanggal}}, etc.
            $table->jsonb('layout_config')->nullable(); // Config for margins, orientations, etc.
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
        Schema::dropIfExists('template_surats');
    }
};
