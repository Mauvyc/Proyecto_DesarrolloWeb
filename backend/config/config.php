<?php
/**
 * Configuración de la aplicación
 * Equivalente a config.js en Node.js
 */

// Cargar variables de entorno desde .env si existe
if (file_exists(__DIR__ . '/../.env')) {
    $lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false) {
            list($name, $value) = explode('=', $line, 2);
            putenv(trim($name) . '=' . trim($value));
            $_ENV[trim($name)] = trim($value);
        }
    }
}

// Variables de entorno con valores por defecto
define('PORT', getenv('PORT'));
define('NODE_ENV', getenv('NODE_ENV'));

// Base de datos
define('DB_USER', getenv('DB_USER'));
define('DB_PASSWORD', getenv('DB_PASSWORD'));
define('DB_HOST', getenv('DB_HOST'));
define('DB_PORT', getenv('DB_PORT'));
define('DB_DATABASE', getenv('DB_DATABASE'));
define('DB_SCHEMA', getenv('DB_SCHEMA'));
define('DB_SSL', getenv('DB_SSL') === 'false' ? false : true);

// JWT (JSON Web Token)
define('JWT_SECRET', getenv('JWT_SECRET'));
define('JWT_EXPIRES_IN', getenv('JWT_EXPIRES_IN'));

// CORS
define('FRONTEND_URL', getenv('FRONTEND_URL'));
define('ALLOWED_ORIGINS', [FRONTEND_URL]); 