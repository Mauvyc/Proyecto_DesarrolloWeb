<?php
/**
 * Formateador de respuestas para mantener consistencia en la API
 * Equivalente a responseFormatter.js
 */

/**
 * Formatear respuesta exitosa
 * @param array|null $data Datos de respuesta
 * @param string $message Mensaje de éxito
 * @param int $statusCode Código de estado HTTP (default: 200)
 * @return array Respuesta formateada
 */
function formatSuccess($data = null, $message = 'Operación exitosa', $statusCode = 200) {
    return [
        'success' => true,
        'message' => $message,
        'data' => $data,
        'code' => $statusCode
    ];
}

/**
 * Formatear respuesta de error
 * @param string $message Mensaje de error
 * @param int $statusCode Código de estado HTTP (default: 400)
 * @param mixed $error Detalles del error
 * @return array Respuesta formateada
 */
function formatError($message = 'Error en la operación', $statusCode = 400, $error = null) {
    return [
        'success' => false,
        'message' => $message,
        'error' => $error,
        'code' => $statusCode
    ];
}

/**
 * Enviar respuesta al cliente
 * @param array $formattedResponse Respuesta formateada
 * @return void
 */
function sendResponse($formattedResponse) {
    $statusCode = $formattedResponse['code'];
    unset($formattedResponse['code']);
    
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($formattedResponse);
    exit;
} 