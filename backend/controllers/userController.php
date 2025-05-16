<?php
/**
 * Controlador para gestionar usuarios
 * Equivalente a userController.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Obtiene todos los usuarios
 */
function getAllUsers() {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.usuario";
        $result = pg_query($conn, $query);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $users = pg_fetch_all($result);
        
        $response = formatSuccess(
            ['users' => $users],
            'Usuarios obtenidos exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener usuarios: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener usuarios',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}