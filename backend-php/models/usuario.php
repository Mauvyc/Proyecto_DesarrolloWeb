<?php
/**
 * Modelo para gestionar usuarios
 * Equivalente a usuario.js
 */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../config/config.php';

/**
 * Buscar usuario por email
 * @param string $email Email del usuario
 * @return array|null Datos del usuario o null si no existe
 */
function findUserByEmail($email) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT * FROM $schema.usuario WHERE email = $1";
        $result = pg_query_params($conn, $query, [$email]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $user = pg_fetch_assoc($result);
        pg_close($conn);
        
        return $user;
    } catch (Exception $error) {
        error_log('Error al buscar usuario por email: ' . $error->getMessage());
        pg_close($conn);
        return null;
    }
}

/**
 * Buscar usuario por ID
 * @param int $id ID del usuario
 * @return array|null Datos del usuario o null si no existe
 */
function findUserById($id) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        $query = "SELECT usuarioid, nombre, apellido, email, rol FROM $schema.usuario WHERE usuarioid = $1";
        $result = pg_query_params($conn, $query, [$id]);
        
        if (!$result) {
            throw new Exception(pg_last_error($conn));
        }
        
        $user = pg_fetch_assoc($result);
        pg_close($conn);
        
        return $user;
    } catch (Exception $error) {
        error_log('Error al buscar usuario por ID: ' . $error->getMessage());
        pg_close($conn);
        return null;
    }
}

/** * Validar credenciales de usuario * @param string $email Email del usuario * @param string $password Contraseña sin hash * @return array|null Datos del usuario si las credenciales son válidas, null en caso contrario */
function validateCredentials($email, $password) {
    $user = findUserByEmail($email);
    
    if (!$user) {
        return null;
    }
    
    // Verificar contraseu00f1a con password_verify (equivalente a bcrypt.compare)
    if (!password_verify($password, $user['password'])) {
        return null;
    }
    
    return $user;
} 