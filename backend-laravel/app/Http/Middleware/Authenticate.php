<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Tymon\JWTAuth\Facades\JWTAuth;

class Authenticate
{
public function handle($request, Closure $next)
{
    try {
        $token = JWTAuth::getToken();
        if (!$token) {
            return response()->json(['message' => 'Token no enviado'], 401);
        }

        $user = JWTAuth::parseToken()->authenticate();
        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 401);
        }
    } catch (Exception $e) {
        return response()->json([
            'message' => 'No autenticado', 
            'error' => $e->getMessage()
        ], 401);
    }

    return $next($request);
}


}
