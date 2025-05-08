import { Pool } from 'pg';

// Configuración de la conexión
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bd_seguros',
  password: '', // Intentando sin contraseña
  port: 5432,
  ssl: false
});

// Ejecutar la consulta
const queryUsuarios = async () => {
  try {
    const result = await pool.query('SELECT * FROM usuario');
    console.log(JSON.stringify(result.rows, null, 2));
  } catch (error) {
    console.error('Error al consultar la tabla usuario:', error);
  } finally {
    pool.end();
  }
};

queryUsuarios(); 