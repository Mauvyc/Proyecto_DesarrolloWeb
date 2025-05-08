import { Pool } from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno si existen
dotenv.config();

// Configuración de la conexión según backend/config.js
const pool = new Pool({
  user: process.env.DB_USER || 'bd_seguros',
  host: process.env.DB_HOST || 'dpg-d0bs4i1r0fns73dql5hg-a.oregon-postgres.render.com',
  database: process.env.DB_DATABASE || 'bd_seguros',
  password: process.env.DB_PASSWORD || 'zkbeqPkMJUVH5EfwEEEXXz43LmAyDMfP',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false }
});

// Ejecutar la consulta exacta proporcionada por el usuario
const queryUsuarios = async () => {
  try {
    const result = await pool.query(`
      SELECT usuarioid, nombre, apellido, email, password, rol
      FROM app_schema.usuario;
    `);
    console.log('Consulta exitosa:');
    console.log(JSON.stringify(result.rows, null, 2));
    console.log(`Total de usuarios encontrados: ${result.rows.length}`);
  } catch (error) {
    console.error('Error al consultar la tabla usuario:', error);
  } finally {
    await pool.end();
  }
};

queryUsuarios(); 