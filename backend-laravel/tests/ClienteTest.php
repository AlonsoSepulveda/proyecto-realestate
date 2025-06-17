<?php

namespace Tests;

use App\Models\Cliente;

class ClienteTest extends TestCase
{
    /** @test */
    public function puede_crear_un_cliente()
    {
        $cliente = Cliente::create([
            'nombre' => 'Cliente Test',
            'apellido' => 'Apellido Test',
            'rut' => '12345678-9',
            'email' => 'cliente@example.com',
            'telefono' => '123456789',
        ]);

        $this->assertNotNull($cliente->id);
        $this->assertEquals('Cliente Test', $cliente->nombre);
        $this->assertEquals('cliente@example.com', $cliente->email);
    }
}
