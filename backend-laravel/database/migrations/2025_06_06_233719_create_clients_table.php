<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
    $table->uuid('id')->primary();
    $table->string('rut')->unique();
    $table->string('nombre');
    $table->string('apellido');
    $table->string('email')->unique();
    $table->string('telefono');
    $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
