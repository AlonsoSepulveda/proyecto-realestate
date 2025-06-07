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
        Schema::create('units', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('numero_unidad');
    $table->string('tipo_unidad'); // Departamento, Casa, etc.
    $table->float('metraje_cuadrado');
    $table->decimal('precio_venta', 12, 2);
    $table->string('estado'); // Disponible, Vendido, Reservado, etc.
    $table->uuid('proyecto_id'); // FK
    $table->uuid('cliente_id')->nullable(); // FK opcional
    $table->timestamps();

    $table->foreign('proyecto_id')->references('id')->on('projects')->onDelete('cascade');
    $table->foreign('cliente_id')->references('id')->on('clients')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
