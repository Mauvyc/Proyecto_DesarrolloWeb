import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';
import { DB_SCHEMA } from '../config/config.js';

// Controlador para obtener todos los usuarios
export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM ${DB_SCHEMA}.usuario`);
        
        const response = ResponseFormatter.success(
            { users: result.rows },
            "Usuarios obtenidos exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        const response = ResponseFormatter.error(
            "Error al obtener usuarios",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 