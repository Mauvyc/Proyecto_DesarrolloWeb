import { pool } from '../utils/db.js';
import ResponseFormatter from '../views/responseFormatter.js';

export const ping = async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        
        const response = ResponseFormatter.success(
            {
                pong: result.rows[0].now,
                status: 'success'
            },
            'Servidor en línea',
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error en ping:", error);
        
        const response = ResponseFormatter.error(
            'Error al verificar estado del servidor',
            500,
            error.message
        );
        
        return ResponseFormatter.send(res, response);
    }
}; 