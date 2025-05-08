import { Pool } from 'pg';

// Este script prueba la conexión a la base de datos con valores específicos
// para depurar problemas de conexión en entornos de producción.

const testDbConnection = async () => {
    console.log('Iniciando prueba de conexión a la base de datos...');
    
    // Crear un pool de conexión con los valores correctos de Render
    // según la información de la captura de pantalla
    const pool = new Pool({
        user: 'bd_seguros',
        host: 'dpg-d0bs4i1r0fns73dql5hg-a.oregon-postgres.render.com',
        database: 'bd_seguros',
        password: 'zkbeqPkMJUVH5EfwEEEXXz43LmAyDMfP',
        port: 5432,
        ssl: { rejectUnauthorized: false },
    });
    
    try {
        console.log('Intentando conexión...');
        const result = await pool.query('SELECT NOW()');
        console.log('¡Conexión exitosa!');
        console.log('Hora del servidor:', result.rows[0].now);
        
        // Verificar que existen las tablas necesarias
        try {
            const tablesResult = await pool.query(`
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'app_schema'
            `);
            
            console.log('Tablas encontradas en el esquema app_schema:');
            tablesResult.rows.forEach(row => {
                console.log(`- ${row.table_name}`);
            });
            
            // Si no hay resultados, es posible que no exista el esquema
            if (tablesResult.rows.length === 0) {
                console.log('⚠️ No se encontraron tablas en el esquema app_schema.');
                console.log('Verificando si existe el esquema...');
                
                const schemaResult = await pool.query(`
                    SELECT schema_name
                    FROM information_schema.schemata
                    WHERE schema_name = 'app_schema'
                `);
                
                if (schemaResult.rows.length === 0) {
                    console.log('❌ El esquema app_schema no existe. Se debe crear.');
                } else {
                    console.log('✅ El esquema app_schema existe pero no tiene tablas.');
                }
            }
            
        } catch (tableError) {
            console.error('Error al consultar las tablas:', tableError.message);
        }
        
    } catch (error) {
        console.error('Error de conexión:', error.message);
        if (error.code) {
            console.error('Código de error:', error.code);
        }
        if (error.stack) {
            console.error('Stack de error:', error.stack);
        }
    } finally {
        await pool.end();
        console.log('Prueba de conexión finalizada.');
    }
};

// Ejecutar la prueba
testDbConnection().catch(err => {
    console.error('Error general:', err);
}); 