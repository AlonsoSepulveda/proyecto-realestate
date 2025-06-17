<?php

namespace Tests;

use App\Models\UnidadPropiedad;
use App\Models\ProyectoInmobiliario;

class UnidadPropiedadTest extends TestCase
{
    /** @test */
    public function puede_crear_una_unidad()
    {
        $proyecto = ProyectoInmobiliario::create([
            'nombre' => 'Proyecto Unidad Test',
            'descripcion' => 'Proyecto para unidad',
            'ubicacion' => 'Ciudad Test',
            'fecha_inicio' => '2025-06-12',
            'fecha_finalizacion' => '2025-09-12',
            'estado' => 'Activo',
        ]);

        $unidad = UnidadPropiedad::create([
            'numero_unidad' => 'A101',
            'tipo_unidad' => 'Departamento',
            'estado' => 'Disponible',
            'metraje_cuadrado' => '45',
            'proyecto_id' => $proyecto->id,
        ]);

        $this->assertNotNull($unidad->id);
        $this->assertEquals('A101', $unidad->numero_unidad);
        $this->assertEquals($proyecto->id, $unidad->proyecto_id);
    }
}
