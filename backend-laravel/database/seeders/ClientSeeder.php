<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cliente;

class ClientSeeder extends Seeder
{
    public function run()
    {
        for ($i = 1; $i <= 1; $i++) {
            Cliente::create([
                'rut' => '1234567' . $i . '-K',
                'nombre' => 'Nombre' . $i,
                'apellido' => 'Apellido' . $i,
                'email' => 'cliente' . $i . '@mail.com',
                'telefono' => '+5691234567' . $i,
            ]);
        }
    }
}
