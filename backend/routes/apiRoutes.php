<?php
/**
 * Rutas de la API principal
 * Equivalente a apiRoutes.js
 */

require_once __DIR__ . '/../utils/authUtils.php';
require_once __DIR__ . '/../controllers/userController.php';

// Obtener el mu00e9todo HTTP y la ruta
$method = $_SERVER['REQUEST_METHOD'];

// Obtener los paru00e1metros de ruta
$segments = isset($segments) ? $segments : explode('/', trim($path, '/'));
$resource = $segments[0] ?? '';
$id = $segments[1] ?? null;
$subresource = $segments[2] ?? null;

// Manejar rutas segu00fan el recurso solicitado
switch ($resource) {
    case 'ping':
        if ($method === 'GET') {
            // Incluir controlador solo si es necesario
            require_once __DIR__ . '/../controllers/pingController.php';
            ping();
            exit;
        }
        break;
    
    case 'users':
        if ($method === 'GET') {
            // Verificar token antes de continuar
            verifyToken();
            getAllUsers();
            exit;
        }
        break;
    
    case 'polizas':
        // Incluir controlador solo si es necesario
        require_once __DIR__ . '/../controllers/polizaController.php';
        
        if ($method === 'POST') {
            verifyToken();
            crearPoliza();
            exit;
        } elseif ($method === 'GET' && $id && $subresource === 'beneficiario') {
            verifyToken();
            getPolizasByBeneficiario($segments[3] ?? null);
            exit;
        } elseif ($method === 'GET' && $id) {
            verifyToken();
            getPolizaById($id);
            exit;
        }
        break;
    
    case 'vehiculos':
        // Incluir controlador solo si es necesario
        require_once __DIR__ . '/../controllers/vehiculoController.php';
        
        if ($method === 'POST') {
            verifyToken();
            registrarVehiculo();
            exit;
        } elseif ($method === 'GET' && $id && $subresource === 'beneficiario') {
            verifyToken();
            getVehiculosByBeneficiario($segments[3] ?? null);
            exit;
        } elseif ($method === 'GET' && $id) {
            verifyToken();
            getVehiculoById($id);
            exit;
        }
        break;
    
    case 'pagos':
        // Incluir controlador solo si es necesario
        require_once __DIR__ . '/../controllers/pagoController.php';
        
        if ($method === 'POST') {
            verifyToken();
            registrarPago();
            exit;
        } elseif ($method === 'GET' && $id && $subresource === 'presupuesto') {
            verifyToken();
            getPagosByPresupuesto($segments[3] ?? null);
            exit;
        }
        break;
    
    case 'notificaciones':
        // Incluir controlador solo si es necesario
        require_once __DIR__ . '/../controllers/notificacionController.php';
        
        if ($method === 'GET') {
            verifyToken();
            getNotificaciones();
            exit;
        }
        break;
} 