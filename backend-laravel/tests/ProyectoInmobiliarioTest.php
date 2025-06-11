<?php

namespace Tests;

use App\Models\ProyectoInmobiliario;

class ProyectoInmobiliarioTest extends TestCase
{
    /** @test */
    public function puede_crear_un_proyecto()
    {
        $proyecto = ProyectoInmobiliario::create([
            'nombre' => 'Proyecto Test',
            'descripcion' => 'Descripción de prueba',
            'ubicacion' => 'Ciudad Test',
            'fecha_inicio' => '2025-06-10',
            'fecha_finalizacion' => '2025-12-31',
            'estado' => 'Activo',
        ]);

        $this->assertNotNull($proyecto->id);
        $this->assertEquals('Proyecto Test', $proyecto->nombre);
    }
}
