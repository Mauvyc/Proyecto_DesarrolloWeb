import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';
import { DB_SCHEMA } from '../config/config.js';

// Función para verificar si el usuario tiene algún vehículo registrado
const tieneVehiculo = async (beneficiarioId) => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM ${DB_SCHEMA}.vehiculo WHERE beneficiarioid = $1`,
        [beneficiarioId]
    );
    return parseInt(result.rows[0].count) > 0;
};

// Función para verificar si el usuario tiene alguna póliza
const tienePoliza = async (beneficiarioId) => {
    const result = await pool.query(
        `SELECT COUNT(*) FROM ${DB_SCHEMA}.poliza WHERE beneficiarioid = $1`,
        [beneficiarioId]
    );
    return parseInt(result.rows[0].count) > 0;
};

// Controlador para obtener notificaciones del usuario
export const getNotificaciones = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Obtener el ID del beneficiario asociado al usuario
        const beneficiarioResult = await pool.query(
            `SELECT beneficiarioid FROM ${DB_SCHEMA}.beneficiario WHERE usuarioid = $1`,
            [userId]
        );
        
        if (beneficiarioResult.rows.length === 0) {
            const response = ResponseFormatter.error(
                "Usuario no es un beneficiario",
                400
            );
            return ResponseFormatter.send(res, response);
        }
        
        const beneficiarioId = beneficiarioResult.rows[0].beneficiarioid;
        
        // Verificar si tiene vehículo y póliza
        const vehiculoRegistrado = await tieneVehiculo(beneficiarioId);
        const polizaRegistrada = await tienePoliza(beneficiarioId);
        
        // Crear lista de notificaciones
        const notificaciones = [];
        
        if (!polizaRegistrada) {
            notificaciones.push({
                id: 1,
                tipo: "advertencia",
                mensaje: "Falta elegir una Póliza",
                accion: "/elegir-poliza"
            });
        }
        
        if (!vehiculoRegistrado) {
            notificaciones.push({
                id: 2,
                tipo: "advertencia",
                mensaje: "Falta registrar un Vehículo",
                accion: "/registrar-vehiculo"
            });
        }
        
        const response = ResponseFormatter.success(
            { 
                notificaciones,
                total: notificaciones.length
            },
            "Notificaciones obtenidas exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener notificaciones:", error);
        const response = ResponseFormatter.error(
            "Error al obtener notificaciones",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 