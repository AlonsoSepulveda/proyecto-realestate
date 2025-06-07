<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

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
            $data = $request->validate([
                'rut' => 'required|string|unique:clientes,rut',
                'nombre' => 'required|string',
                'apellido' => 'required|string',
                'correo' => 'required|email',
                'telefono' => 'required|string',
            ]);

            $cliente = Cliente::create($data);
            return response()->json($cliente, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al crear el cliente.'], 500);
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
            $cliente->update($request->all());
            return response()->json($cliente);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al actualizar el cliente.'], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $cliente = Cliente::findOrFail($id);
            $cliente->delete();
            return response()->json(['message' => 'Cliente eliminado.'], 204);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar el cliente.'], 500);
        }
    }
}
