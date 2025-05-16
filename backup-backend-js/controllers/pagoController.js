import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';
import { DB_SCHEMA } from '../config/config.js';

// Controlador para registrar un pago
export const registrarPago = async (req, res) => {
    try {
        const { presupuestoId, cantidadPagada } = req.body;
        
        const result = await pool.query(
            `INSERT INTO ${DB_SCHEMA}.pago (presupuestoid, cantidadpagada, fechapago) 
             VALUES ($1, $2, NOW()) 
             RETURNING pagoid, presupuestoid, cantidadpagada, fechapago`,
            [presupuestoId, cantidadPagada]
        );
        
        const response = ResponseFormatter.success(
            { pago: result.rows[0] },
            "Pago registrado exitosamente",
            201
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al registrar pago:", error);
        const response = ResponseFormatter.error(
            "Error al registrar pago",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener pagos por presupuesto
export const getPagosByPresupuesto = async (req, res) => {
    try {
        const { presupuestoId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.pago WHERE presupuestoid = $1`,
            [presupuestoId]
        );
        
        const response = ResponseFormatter.success(
            { pagos: result.rows },
            "Pagos obtenidos exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener pagos:", error);
        const response = ResponseFormatter.error(
            "Error al obtener pagos",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 