<?php
/**
 * Controlador para gestionar notificaciones
 * Equivalente a notificacionController.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Verificar si el usuario tiene algu00fan vehu00edculo registrado
 * @param int $beneficiarioId ID del beneficiario
 * @return bool True si tiene vehu00edculo, false en caso contrario
 */
function tieneVehiculo($beneficiarioId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT COUNT(*) FROM $schema.vehiculo WHERE beneficiarioid = $1";
        $result = pg_query_params($conn, $query, [$beneficiarioId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $row = pg_fetch_row($result);
        $count = (int)$row[0];
        
        pg_close($conn);
        
        return $count > 0;
    } catch (Exception $error) {
        error_log('Error al verificar vehículos: ' . $error->getMessage());
        pg_close($conn);
        return false;
    }
}

/**
 * Verificar si el usuario tiene alguna pu00f3liza
 * @param int $beneficiarioId ID del beneficiario
 * @return bool True si tiene pu00f3liza, false en caso contrario
 */
function tienePoliza($beneficiarioId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT COUNT(*) FROM $schema.poliza WHERE beneficiarioid = $1";
        $result = pg_query_params($conn, $query, [$beneficiarioId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $row = pg_fetch_row($result);
        $count = (int)$row[0];
        
        pg_close($conn);
        
        return $count > 0;
    } catch (Exception $error) {
        error_log('Error al verificar pólizas: ' . $error->getMessage());
        pg_close($conn);
        return false;
    }
}

/**
 * Obtener notificaciones del usuario
 */
function getNotificaciones() {
    try {
        // El middleware verifyToken ya agregó la información del usuario en $_REQUEST['user']
        $userId = $_REQUEST['user']['id'];
        
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        // Obtener el ID del beneficiario asociado al usuario
        $query = "SELECT beneficiarioid FROM $schema.beneficiario WHERE usuarioid = $1";
        $result = pg_query_params($conn, $query, [$userId]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $beneficiario = pg_fetch_assoc($result);
        
        if (!$beneficiario) {
            $response = formatError('Usuario no es un beneficiario', 400);
            sendResponse($response);
        }
        
        $beneficiarioId = $beneficiario['beneficiarioid'];
        
        // Verificar si tiene vehículo y póliza
        $vehiculoRegistrado = tieneVehiculo($beneficiarioId);
        $polizaRegistrada = tienePoliza($beneficiarioId);
        
        // Crear lista de notificaciones
        $notificaciones = [];
        
        if (!$polizaRegistrada) {
            $notificaciones[] = [
                'id' => 1,
                'tipo' => 'advertencia',
                'mensaje' => 'Falta elegir una Póliza',
                'accion' => '/elegir-poliza'
            ];
        }
        
        if (!$vehiculoRegistrado) {
            $notificaciones[] = [
                'id' => 2,
                'tipo' => 'advertencia',
                'mensaje' => 'Falta registrar un Vehículo',
                'accion' => '/registrar-vehiculo'
            ];
        }
        
        $response = formatSuccess(
            [ 
                'notificaciones' => $notificaciones,
                'total' => count($notificaciones)
            ],
            'Notificaciones obtenidas exitosamente',
            200
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener notificaciones: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener notificaciones',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
} 