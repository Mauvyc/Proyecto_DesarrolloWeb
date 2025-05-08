import { Pool } from 'pg';

const testCredentials = async () => {
  // Array de combinaciones de credenciales para probar
  const credentialsToTest = [
    {
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      database: 'bd_seguros',
      port: 5432
    },
    {
      user: 'postgres',
      password: '',
      host: 'localhost',
      database: 'bd_seguros',
      port: 5432
    },
    {
      user: 'root',
      password: 'root',
      host: 'localhost',
      database: 'bd_seguros',
      port: 5432
    },
    {
      user: 'admin',
      password: 'admin',
      host: 'localhost',
      database: 'bd_seguros',
      port: 5432
    }
  ];

  for (const credentials of credentialsToTest) {
    try {
      console.log(`Probando con usuario: ${credentials.user}, contraseña: ${credentials.password ? '****' : '[vacía]'}`);
      
      const pool = new Pool(credentials);
      
      // Intentar conectar y hacer una consulta simple
      const result = await pool.query('SELECT NOW()');
      console.log('¡Conexión exitosa!');
      console.log('Hora del servidor:', result.rows[0].now);
      
      // Si llegamos aquí, intentar consultar la tabla usuario
      try {
        const userResult = await pool.query('SELECT * FROM usuario');
        console.log('Consulta a la tabla usuario exitosa!');
        console.log(`Número de usuarios encontrados: ${userResult.rows.length}`);
        console.log(JSON.stringify(userResult.rows, null, 2));
      } catch (userError) {
        console.error('Error al consultar la tabla usuario:', userError.message);
      }
      
      await pool.end();
      // Si encontramos una conexión exitosa, terminamos
      return;
    } catch (error) {
      console.error(`Error con credenciales ${credentials.user}:`, error.message);
    }
  }
  
  console.log('No se pudo conectar con ninguna de las credenciales probadas.');
};

testCredentials(); 