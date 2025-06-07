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
        Schema::create('projects', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('nombre');
    $table->text('descripcion')->nullable();
    $table->string('ubicacion');
    $table->date('fecha_inicio');
    $table->date('fecha_finalizacion');
    $table->string('estado'); // En construcción, Terminado, etc.
    $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
