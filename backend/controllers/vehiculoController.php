<?php
/**
 * Controlador para gestionar vehu00edculos
 * Equivalente a vehiculoController.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Registrar un vehu00edculo
 */
function registrarVehiculo() {
    try {
        // Obtener datos del request
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $response = formatError('Datos de vehu00edculo invu00e1lidos', 400);
            sendResponse($response);
        }
        
        $placa = $data['placa'] ?? '';
        $marca = $data['marca'] ?? '';
        $modelo = $data['modelo'] ?? '';
        $tipo = $data['tipo'] ?? '';
        $beneficiarioId = $data['beneficiarioId'] ?? null;
        
        if (!$beneficiarioId) {
            $response = formatError('El ID del beneficiario es requerido', 400);
            sendResponse($response);
        }
        
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "INSERT INTO $schema.vehiculo (placa, marca, modelo, tipo, beneficiarioid) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING vehiculoid, placa, marca, modelo, tipo, beneficiarioid";
        
        $result = pg_query_params($conn, $query, [$placa, $marca, $modelo, $tipo, $beneficiarioId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $vehiculo = pg_fetch_assoc($result);
        
        $response = formatSuccess(
            ['vehiculo' => $vehiculo],
            'Vehu00edculo registrado exitosamente',
            201
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al registrar vehu00edculo: ' . $error->getMessage());
        $response = formatError(
            'Error al registrar vehu00edculo',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener todos los vehu00edculos de un beneficiario
 * @param int $beneficiarioId ID del beneficiario
 */
function getVehiculosByBeneficiario($beneficiarioId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.vehiculo WHERE beneficiarioid = $1";
        $result = pg_query_params($conn, $query, [$beneficiarioId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $vehiculos = pg_fetch_all($result) ?: [];
        
        $response = formatSuccess(
            ['vehiculos' => $vehiculos],
            'Vehu00edculos obtenidos exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener vehu00edculos: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener vehu00edculos',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener un vehu00edculo por ID
 * @param int $vehiculoId ID del vehu00edculo
 */
function getVehiculoById($vehiculoId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.vehiculo WHERE vehiculoid = $1";
        $result = pg_query_params($conn, $query, [$vehiculoId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $vehiculo = pg_fetch_assoc($result);
        
        if (!$vehiculo) {
            $response = formatError('Vehu00edculo no encontrado', 404);
            sendResponse($response);
        }
        
        $response = formatSuccess(
            ['vehiculo' => $vehiculo],
            'Vehu00edculo obtenido exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener vehu00edculo: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener vehu00edculo',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
} 