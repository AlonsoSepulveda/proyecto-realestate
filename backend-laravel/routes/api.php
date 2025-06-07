<?php

/** @var \Laravel\Lumen\Routing\Router $router */

// Rutas públicas
$router->post('/login', 'AuthController@login');
$router->post('/register', 'AuthController@register');

// Rutas protegidas con JWT
$router->group(['middleware' => 'auth'], function () use ($router) {

    // Proyectos
    $router->get('/proyectos', 'ProyectoController@index');
    $router->post('/proyectos', 'ProyectoController@store');
    $router->get('/proyectos/{id}', 'ProyectoController@show');
    $router->put('/proyectos/{id}', 'ProyectoController@update');
    $router->delete('/proyectos/{id}', 'ProyectoController@destroy');

    // Unidades
    $router->get('/unidades', 'UnidadController@index');
    $router->post('/unidades', 'UnidadController@store');
    $router->get('/unidades/{id}', 'UnidadController@show');
    $router->put('/unidades/{id}', 'UnidadController@update');
    $router->delete('/unidades/{id}', 'UnidadController@destroy');

    // Clientes
    $router->get('/clientes', 'ClienteController@index');
    $router->post('/clientes', 'ClienteController@store');
    $router->get('/clientes/{id}', 'ClienteController@show');
    $router->put('/clientes/{id}', 'ClienteController@update');
    $router->delete('/clientes/{id}', 'ClienteController@destroy');

});
