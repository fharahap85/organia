<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Organia');
            $table->string('logo_url')->nullable();
            $table->text('visi')->nullable();
            $table->text('misi')->nullable();
            $table->text('sejarah')->nullable();
            $table->string('kontak')->nullable();
            $table->boolean('is_public_page_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_profiles');
    }
};
