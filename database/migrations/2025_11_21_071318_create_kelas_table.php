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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kelas'); // e.g., "XII IPA 1"
            $table->string('tingkat'); // e.g., "10", "11", "12"
            $table->string('jurusan')->nullable(); // IPA, IPS, Bahasa
            $table->string('wali_kelas')->nullable();
            $table->integer('kapasitas')->default(30);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
