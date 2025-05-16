import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';
import { DB_SCHEMA } from '../config/config.js';

// Controlador para registrar un vehículo
export const registrarVehiculo = async (req, res) => {
    try {
        const { placa, marca, modelo, tipo, beneficiarioId } = req.body;
        
        const result = await pool.query(
            `INSERT INTO ${DB_SCHEMA}.vehiculo (placa, marca, modelo, tipo, beneficiarioid) 
             VALUES ($1, $2, $3, $4, $5) 
             RETURNING vehiculoid, placa, marca, modelo, tipo, beneficiarioid`,
            [placa, marca, modelo, tipo, beneficiarioId]
        );
        
        const response = ResponseFormatter.success(
            { vehiculo: result.rows[0] },
            "Vehículo registrado exitosamente",
            201
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al registrar vehículo:", error);
        const response = ResponseFormatter.error(
            "Error al registrar vehículo",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener todos los vehículos de un beneficiario
export const getVehiculosByBeneficiario = async (req, res) => {
    try {
        const { beneficiarioId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.vehiculo WHERE beneficiarioid = $1`,
            [beneficiarioId]
        );
        
        const response = ResponseFormatter.success(
            { vehiculos: result.rows },
            "Vehículos obtenidos exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        const response = ResponseFormatter.error(
            "Error al obtener vehículos",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener un vehículo por ID
export const getVehiculoById = async (req, res) => {
    try {
        const { vehiculoId } = req.params;
        
        const result = await pool.query(
            `SELECT * FROM ${DB_SCHEMA}.vehiculo WHERE vehiculoid = $1`,
            [vehiculoId]
        );
        
        if (result.rows.length === 0) {
            const response = ResponseFormatter.error(
                "Vehículo no encontrado",
                404
            );
            return ResponseFormatter.send(res, response);
        }
        
        const response = ResponseFormatter.success(
            { vehiculo: result.rows[0] },
            "Vehículo obtenido exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener vehículo:", error);
        const response = ResponseFormatter.error(
            "Error al obtener vehículo",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 