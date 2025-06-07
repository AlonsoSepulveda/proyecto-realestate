<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ProyectoInmobiliario extends Model
{
    use HasUuids;

    protected $table = 'projects';

    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
        'fecha_inicio',
        'fecha_finalizacion',
        'estado',
    ];

// app/Models/ProyectoInmobiliario.php

public function unidades()
{
    return $this->hasMany(Unidad::class);
}

public function cliente()
{
    return $this->belongsTo(Cliente::class);
}

}
