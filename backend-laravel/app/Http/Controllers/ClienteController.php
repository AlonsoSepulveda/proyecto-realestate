<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClienteController extends Controller
{
    public function index()
    {
        try {
            $clientes = Cliente::with('unidades')->paginate(10);
            return response()->json($clientes);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al listar clientes.'], 500);
        }
    }

public function store(Request $request) 
{
    try {
        $validator = Validator::make($request->all(), [
            'rut' => 'required|string|unique:clients,rut',
            'nombre' => 'required|string',
            'apellido' => 'required|string',
            'email' => 'required|email',
            'telefono' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validación fallida.',
                'errors' => $validator->errors()
            ], 422);
        }

        $cliente = Cliente::create($validator->validated());

        return response()->json($cliente, 201);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al crear el cliente.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show($id)
    {
        try {
            $cliente = Cliente::with('unidades')->findOrFail($id);
            return response()->json($cliente);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Cliente no encontrado.'], 404);
        }
    }


public function update(Request $request, $id)
{
    try {
        $cliente = Cliente::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'rut' => 'sometimes|string|unique:clients,rut,' . $id,
            'nombre' => 'sometimes|string',
            'apellido' => 'sometimes|string',
            'email' => 'sometimes|email',
            'telefono' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validación fallida.',
                'errors' => $validator->errors()
            ], 422);
        }

        $cliente->update($validator->validated());

        return response()->json([
            'message' => 'Cliente actualizado correctamente.',
            'cliente' => $cliente
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error al actualizar el cliente.',
            'error' => $e->getMessage()
        ], 500);
    }
}

 public function destroy($id)
{
    try {
        $cliente = Cliente::findOrFail($id);
        $cliente->delete();
        return response()->json(['message' => 'Cliente eliminado correctamente.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al eliminar el cliente.', 'error' => $e->getMessage()], 500);
    }
}

}
