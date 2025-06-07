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
        // Parámetros para paginación y ordenamiento
        $perPage = $request->input('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');

        // Construir la consulta incluyendo las relaciones que quieres cargar (ejemplo: unidades, clientes)
        $query = ProyectoInmobiliario::with(['unidades', 'cliente']);

        // Ordenar y paginar
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

        return response()->json([
            'message' => 'Proyecto actualizado con éxito.',
            'proyecto' => $proyecto
        ], 200);
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

        // Guardamos la info para devolverla luego
        $proyectoEliminado = $proyecto->toArray();

        $proyecto->delete();

        return response()->json([
            'message' => 'Proyecto eliminado con éxito.',
            'proyecto' => $proyectoEliminado
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al eliminar el proyecto.',
            'error' => $e->getMessage()
        ], 500);
    }
}


}
