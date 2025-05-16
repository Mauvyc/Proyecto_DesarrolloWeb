<?php
/**
 * Controlador para gestionar pu00f3lizas
 * Equivalente a polizaController.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Crear una pu00f3liza
 */
function crearPoliza() {
    try {
        // Obtener datos del request
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $response = formatError('Datos de pu00f3liza invu00e1lidos', 400);
            sendResponse($response);
        }
        
        $beneficiarioId = $data['beneficiarioId'] ?? null;
        $tipoPoliza = $data['tipoPoliza'] ?? '';
        $fechaInicio = $data['fechaInicio'] ?? null;
        $fechaFin = $data['fechaFin'] ?? null;
        $estado = $data['estado'] ?? 'Activa';
        
        if (!$beneficiarioId) {
            $response = formatError('El ID del beneficiario es requerido', 400);
            sendResponse($response);
        }
        
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        // Usar la funciu00f3n almacenada sp_crearpoliza
        $query = "SELECT * FROM $schema.sp_crearpoliza($1, $2, $3, $4, $5)";
        $result = pg_query_params($conn, $query, [$beneficiarioId, $tipoPoliza, $fechaInicio, $fechaFin, $estado]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $row = pg_fetch_assoc($result);
        $polizaId = $row['p_polizaid'];
        
        $response = formatSuccess(
            [
                'polizaId' => $polizaId,
                'beneficiarioId' => $beneficiarioId,
                'tipoPoliza' => $tipoPoliza,
                'fechaInicio' => $fechaInicio,
                'fechaFin' => $fechaFin,
                'estado' => $estado 
            ],
            'Pu00f3liza creada exitosamente',
            201
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al crear pu00f3liza: ' . $error->getMessage());
        $response = formatError(
            'Error al crear pu00f3liza',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener todas las pu00f3lizas de un beneficiario
 * @param int $beneficiarioId ID del beneficiario
 */
function getPolizasByBeneficiario($beneficiarioId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.poliza WHERE beneficiarioid = $1";
        $result = pg_query_params($conn, $query, [$beneficiarioId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $polizas = pg_fetch_all($result) ?: [];
        
        $response = formatSuccess(
            ['polizas' => $polizas],
            'Pu00f3lizas obtenidas exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener pu00f3lizas: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener pu00f3lizas',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener una pu00f3liza por ID
 * @param int $polizaId ID de la pu00f3liza
 */
function getPolizaById($polizaId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.poliza WHERE polizaid = $1";
        $result = pg_query_params($conn, $query, [$polizaId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $poliza = pg_fetch_assoc($result);
        
        if (!$poliza) {
            $response = formatError('Pu00f3liza no encontrada', 404);
            sendResponse($response);
        }
        
        $response = formatSuccess(
            ['poliza' => $poliza],
            'Pu00f3liza obtenida exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener pu00f3liza: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener pu00f3liza',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
} 