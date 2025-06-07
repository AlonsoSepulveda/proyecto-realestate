<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Cliente extends Model
{
    use HasUuids;

    protected $table = 'clients';

    protected $fillable = [
        'rut',
        'nombre',
        'apellido',
        'email',
        'telefono',
    ];

    public function unidades()
    {
        return $this->hasMany(UnidadPropiedad::class, 'cliente_id');
    }
}
