<?php
/**
 * Rutas de autenticaciu00f3n
 * Equivalente a authRoutes.js
 */

require_once __DIR__ . '/../utils/authUtils.php';
require_once __DIR__ . '/../controllers/authController.php';

// Obtener el mu00e9todo HTTP y la ruta
$method = $_SERVER['REQUEST_METHOD'];

// Obtener los paru00e1metros de ruta
$segments = isset($segments) ? $segments : explode('/', trim($path, '/'));
$resource = $segments[1] ?? ''; // El segmento 0 es 'auth', por lo que necesitamos el siguiente

// Manejar rutas segu00fan el recurso solicitado
switch ($resource) {
    case 'register':
        if ($method === 'POST') {
            register();
            exit;
        }
        break;
        
    case 'login':
        if ($method === 'POST') {
            login();
            exit;
        }
        break;
        
    case 'profile':
        if ($method === 'GET') {
            verifyToken();
            getProfile();
            exit;
        }
        break;
}

// Si llegamos aquu00ed, no se encontru00f3 una ruta vu00e1lida
$response = formatError('Ruta de autenticaciu00f3n no encontrada', 404);
sendResponse($response); 