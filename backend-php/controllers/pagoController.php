<?php
/**
 * Controlador para gestionar pagos
 * Equivalente a pagoController.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Registrar un pago
 */
function registrarPago() {
    try {
        // Obtener datos del request
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $response = formatError('Datos de pago invu00e1lidos', 400);
            sendResponse($response);
        }
        
        $presupuestoId = $data['presupuestoId'] ?? null;
        $cantidadPagada = $data['cantidadPagada'] ?? null;
        
        if (!$presupuestoId || $cantidadPagada === null) {
            $response = formatError('El presupuesto ID y la cantidad pagada son requeridos', 400);
            sendResponse($response);
        }
        
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "INSERT INTO $schema.pago (presupuestoid, cantidadpagada, fechapago) 
                 VALUES ($1, $2, NOW()) 
                 RETURNING pagoid, presupuestoid, cantidadpagada, fechapago";
        
        $result = pg_query_params($conn, $query, [$presupuestoId, $cantidadPagada]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $pago = pg_fetch_assoc($result);
        
        $response = formatSuccess(
            ['pago' => $pago],
            'Pago registrado exitosamente',
            201
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al registrar pago: ' . $error->getMessage());
        $response = formatError(
            'Error al registrar pago',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener pagos por presupuesto
 * @param int $presupuestoId ID del presupuesto
 */
function getPagosByPresupuesto($presupuestoId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.pago WHERE presupuestoid = $1";
        $result = pg_query_params($conn, $query, [$presupuestoId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $pagos = pg_fetch_all($result) ?: [];
        
        $response = formatSuccess(
            ['pagos' => $pagos],
            'Pagos obtenidos exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener pagos: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener pagos',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
} 