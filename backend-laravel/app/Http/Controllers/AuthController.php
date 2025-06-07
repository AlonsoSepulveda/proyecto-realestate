<?php

namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthController extends BaseController
{
    private $key;

    public function __construct()
    {
        // <tu_token_jwt>
        $this->key = env('JWT_SECRET', 'secretpassword'); 
    }

    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $user = new User();
        $user->name = $request->input('name');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $user->save();

        return response()->json(['message' => 'Usuario registrado correctamente'], 201);
    }

    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->input('email'))->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        $payload = [
            'iss' => "lumen-jwt", // issuer
            'sub' => $user->id,   // subject (usuario)
            'iat' => time(),      // tiempo en que se emitió
            'exp' => time() + 60*60 // expiración (1 hora)
        ];

        $jwt = JWT::encode($payload, $this->key, 'HS256');

        return response()->json(['token' => $jwt]);
    }
}
