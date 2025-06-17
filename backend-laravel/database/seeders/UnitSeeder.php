<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UnidadPropiedad;
use App\Models\ProyectoInmobiliario;

class UnitSeeder extends Seeder
{
    public function run()
    {
        $proyectos = ProyectoInmobiliario::take(10)->pluck('id');
        for ($i = 0; $i < 10; $i++) {
            UnidadPropiedad::create([
                'numero_unidad' => 'U-' . ($i + 1),
                'tipo_unidad' => 'Departamento',
                'metraje_cuadrado' => 50 + ($i + 1),
                'precio_venta' => 50000000 + (($i + 1) * 1000000),
                'estado' => 'Disponible',
                'proyecto_id' => $proyectos[$i] ?? null,
                // 'cliente_id' => $i,
            ]);
        }
    }
}
