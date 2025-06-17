<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProyectoInmobiliario;
use Illuminate\Support\Carbon;

class ProjectSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 10; $i++) {
            ProyectoInmobiliario::create([
                'nombre' => 'Proyecto ' . $i,
                'descripcion' => 'Descripción del proyecto ' . $i,
                'ubicacion' => 'Ubicación ' . $i,
                'fecha_inicio' => Carbon::now()->subMonths($i),
                'fecha_finalizacion' => Carbon::now()->addMonths($i),
                'estado' => 'En desarrollo',
            ]);
        }
    }
}
