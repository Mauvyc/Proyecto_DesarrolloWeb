import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';
import { DB_SCHEMA } from '../config/config.js';

// Controlador para crear una póliza
export const crearPoliza = async (req, res) => {
    try {
        const { beneficiarioId, tipoPoliza, fechaInicio, fechaFin, estado } = req.body;
        
        // Usar la función almacenada sp_crearpoliza
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.sp_crearpoliza($1, $2, $3, $4, $5)`,
            [beneficiarioId, tipoPoliza, fechaInicio, fechaFin, estado]
        );
        
        const polizaId = result.rows[0].p_polizaid;
        
        const response = ResponseFormatter.success(
            { 
                polizaId,
                beneficiarioId,
                tipoPoliza,
                fechaInicio,
                fechaFin,
                estado 
            },
            "Póliza creada exitosamente",
            201
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al crear póliza:", error);
        const response = ResponseFormatter.error(
            "Error al crear póliza",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener todas las pólizas de un beneficiario
export const getPolizasByBeneficiario = async (req, res) => {
    try {
        const { beneficiarioId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.poliza WHERE beneficiarioid = $1`,
            [beneficiarioId]
        );
        
        const response = ResponseFormatter.success(
            { polizas: result.rows },
            "Pólizas obtenidas exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener pólizas:", error);
        const response = ResponseFormatter.error(
            "Error al obtener pólizas",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener una póliza por ID
export const getPolizaById = async (req, res) => {
    try {
        const { polizaId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.poliza WHERE polizaid = $1`,
            [polizaId]
        );
        
        if (result.rows.length === 0) {
            const response = ResponseFormatter.error(
                "Póliza no encontrada",
                404
            );
            return ResponseFormatter.send(res, response);
        }
        
        const response = ResponseFormatter.success(
            { poliza: result.rows[0] },
            "Póliza obtenida exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener póliza:", error);
        const response = ResponseFormatter.error(
            "Error al obtener póliza",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 