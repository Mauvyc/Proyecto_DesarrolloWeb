<?php
/**
 * Punto de entrada principal para la API de Seguros
 * Equivalente a index.js en Node.js
 */

// Cargar dependencias
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/utils/db.php';
require_once __DIR__ . '/views/responseFormatter.php';

// Configuración de CORS
header('Access-Control-Allow-Origin: ' . FRONTEND_URL);
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Obtener la URL solicitada
$request_uri = $_SERVER['REQUEST_URI'];
$base_path = '/api'; // Base path para todas las rutas de la API

// Si la URL no comienza con /api, enviar error
if (strpos($request_uri, $base_path) !== 0) {
    $response = formatError('Ruta no encontrada', 404);
    sendResponse($response);
}

// Quitar el prefijo /api para facilitar el enrutamiento
$path = substr($request_uri, strlen($base_path));
$path = parse_url($path, PHP_URL_PATH);

// Eliminar barra final si existe
if (substr($path, -1) === '/') {
    $path = substr($path, 0, -1);
}

// Dividir la ruta en segmentos
$segments = explode('/', trim($path, '/'));
$main_route = $segments[0] ?? '';

// Incluir archivos de rutas basados en la primera parte de la ruta
switch ($main_route) {
    case '':
    case 'ping':
        // Ruta principal o ping
        include_once __DIR__ . '/routes/apiRoutes.php';
        break;
        
    case 'auth':
        // Rutas de autenticación
        include_once __DIR__ . '/routes/authRoutes.php';
        break;
        
    default:
        // Otras rutas de API
        include_once __DIR__ . '/routes/apiRoutes.php';
        break;
}

// Si llegamos aquí, es porque no se encontró ninguna ruta válida
$response = formatError('Ruta no encontrada', 404);
sendResponse($response); 