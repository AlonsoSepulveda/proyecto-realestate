<?php

namespace App\Http\Controllers;

use App\Models\ProyectoInmobiliario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProyectoController extends Controller
{
public function index(Request $request)
{
    try {
        // Paginación
        $perPage = $request->input('per_page', 10);

        // Ordenamiento
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Búsqueda
        $buscar = $request->input('buscar');

        $query = ProyectoInmobiliario::with(['unidades', 'cliente']);

        if ($buscar) {
            $query->where(function ($q) use ($buscar) {
                $q->where('nombre', 'ILIKE', "%$buscar%")
                  ->orWhere('ubicacion', 'ILIKE', "%$buscar%")
                  ->orWhere('descripcion', 'ILIKE', "%$buscar%");
            });
        }

        $proyectos = $query->orderBy($sortBy, $sortDirection)
                           ->paginate($perPage);

        return response()->json($proyectos);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al listar proyectos.',
            'error' => $e->getMessage()
        ], 500);
    }
}


public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string',
            'descripcion' => 'nullable|string',
            'ubicacion' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_finalizacion' => 'nullable|date',
            'estado' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Datos inválidos.',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated(); // datos ya validados

        $proyecto = ProyectoInmobiliario::create($data);

        return response()->json($proyecto, 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al crear el proyecto.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        try {
            $proyecto = ProyectoInmobiliario::with('unidades')->findOrFail($id);
            return response()->json($proyecto);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Proyecto no encontrado.'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $proyecto = ProyectoInmobiliario::findOrFail($id);
            $proyecto->update($request->all());
            return response()->json($proyecto);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el proyecto.'], 500);
        }
    }

public function destroy($id)
{
    try {
        $proyecto = ProyectoInmobiliario::with('unidades')->findOrFail($id);

        if ($proyecto->unidades()->count() > 0) {
            return response()->json(['message' => 'No se puede eliminar un proyecto con unidades asociadas.'], 400);
        }

        $proyecto->delete();
        return response()->json(['message' => 'Proyecto eliminado.'], 204);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al eliminar el proyecto.', 'error' => $e->getMessage()], 500);
    }
}

}
