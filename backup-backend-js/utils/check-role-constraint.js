import { Pool } from 'pg';
import { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, DB_SCHEMA } from '../config/config.js';

// Este script verifica los valores permitidos en la columna rol de la tabla usuario
const checkRoleConstraint = async () => {
    console.log('Verificando restricción de rol en la tabla usuario...');
    
    const pool = new Pool({
        user: DB_USER,
        host: DB_HOST,
        database: DB_DATABASE,
        password: DB_PASSWORD,
        port: DB_PORT,
        ssl: { rejectUnauthorized: false },
    });
    
    try {
        // Consultar la definición de la restricción
        const constraintQuery = `
            SELECT pg_get_constraintdef(oid) AS constraint_definition
            FROM pg_constraint
            WHERE conname = 'usuario_rol_check' 
            AND conrelid = (SELECT oid FROM pg_class WHERE relname = 'usuario')
        `;
        
        const constraintResult = await pool.query(constraintQuery);
        
        if (constraintResult.rows.length > 0) {
            console.log('Definición de la restricción:');
            console.log(constraintResult.rows[0].constraint_definition);
            
            // La definición suele ser algo como: CHECK (rol = ANY (ARRAY['admin'::text, 'user'::text]))
            // Extraer los valores permitidos
            const definition = constraintResult.rows[0].constraint_definition;
            const valuesMatch = definition.match(/ARRAY\[(.*?)\]/);
            
            if (valuesMatch && valuesMatch[1]) {
                const allowedValues = valuesMatch[1].split(',').map(val => 
                    val.trim().replace(/'/g, '').replace(/::text/g, '')
                );
                
                console.log('Valores permitidos para rol:');
                console.log(allowedValues);
            }
        } else {
            console.log('No se encontró la restricción usuario_rol_check');
            
            // Intentar determinar los valores existentes en la columna rol
            const existingRolesQuery = `
                SELECT DISTINCT rol FROM ${DB_SCHEMA}.usuario
            `;
            
            const rolesResult = await pool.query(existingRolesQuery);
            console.log('Roles existentes en la tabla:');
            rolesResult.rows.forEach(row => {
                console.log(`- ${row.rol}`);
            });
        }
        
    } catch (error) {
        console.error('Error al verificar la restricción:', error.message);
    } finally {
        await pool.end();
    }
};

// Ejecutar la verificación
checkRoleConstraint().catch(err => {
    console.error('Error general:', err);
}); 