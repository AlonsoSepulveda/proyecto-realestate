<?php

namespace App\Http\Controllers;

use App\Models\UnidadPropiedad;
use Illuminate\Http\Request;

class UnidadController extends Controller
{
    public function index()
    {
        try {
            $unidades = UnidadPropiedad::with(['proyecto', 'cliente'])->paginate(10);
            return response()->json($unidades);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al listar unidades.'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'numero_unidad' => 'required|string',
                'tipo_unidad' => 'required|string',
                'metraje_cuadrado' => 'required|numeric',
                'precio_venta' => 'required|numeric',
                'estado' => 'required|string',
                'proyecto_id' => 'required|uuid',
                'cliente_id' => 'nullable|uuid',
            ]);

            $unidad = UnidadPropiedad::create($data);
            return response()->json($unidad, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear la unidad.'], 500);
        }
    }

    public function show($id)
    {
        try {
            $unidad = UnidadPropiedad::with(['proyecto', 'cliente'])->findOrFail($id);
            return response()->json($unidad);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Unidad no encontrada.'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $unidad = UnidadPropiedad::findOrFail($id);
            $unidad->update($request->all());
            return response()->json($unidad);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar la unidad.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $unidad = UnidadPropiedad::findOrFail($id);
            $unidad->delete();
            return response()->json(['message' => 'Unidad eliminada.'], 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar la unidad.'], 500);
        }
    }
}
