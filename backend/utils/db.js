import { Pool } from 'pg';
import { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_SSL } from '../config/config.js';

// Configuración del pool de conexión a la base de datos
export const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
    ssl: DB_SSL ? { rejectUnauthorized: false } : false,
});

// Verificar la conexión a la base de datos al iniciar la aplicación
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err);
    } else {
        console.log("Conexión exitosa a la base de datos. Hora del servidor:", res.rows[0].now);
    }
});

export default pool; 