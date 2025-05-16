<?php
/**
 * Conexión a la base de datos PostgreSQL
 * Equivalente a db.js en Node.js
 */

// Incluir el archivo de configuración
require_once __DIR__ . '/../config/config.php';

/**
 * Obtiene la conexión a la base de datos
 * @return resource La conexión PostgreSQL
 * @throws Exception si la conexión falla
 */
function getConnection() {
    $host = DB_HOST;
    $port = DB_PORT;
    $dbname = DB_DATABASE;
    $user = DB_USER;
    $password = DB_PASSWORD;
    
    $connectionString = "host=$host port=$port dbname=$dbname user=$user password=$password";
    
    if (DB_SSL) {
        $connectionString .= " sslmode=require";
    }
    
    $conn = pg_connect($connectionString);
    
    if (!$conn) {
        throw new Exception("Error de conexión a la base de datos: " . pg_last_error());
    }
    
    return $conn;
}

// Verificar la conexión al cargar el archivo
try {
    $conn = getConnection();
    $result = pg_query($conn, "SELECT NOW()");
    $row = pg_fetch_row($result);
    echo "Conexión exitosa a la base de datos. Hora del servidor: " . $row[0] . "\n";
    pg_close($conn);
} catch (Exception $e) {
    echo "Error al conectar a la base de datos: " . $e->getMessage() . "\n";
} 