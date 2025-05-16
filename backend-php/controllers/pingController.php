<?php
/**
 * Controlador para verificar que la API funciona
 * Equivalente a pingController.js
 */

require_once __DIR__ . '/../views/responseFormatter.php';

/**
 * Responde con un simple mensaje de "pong" para verificar que la API funciona
 */
function ping() {
    $response = formatSuccess(
        ['message' => 'pong', 'time' => date('Y-m-d H:i:s')],
        'API funcionando correctamente',
        200
    );
    sendResponse($response);
} 