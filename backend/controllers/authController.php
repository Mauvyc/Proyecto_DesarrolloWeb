<?php
/** * Controlador para autenticaciu00f3n de usuarios * Equivalente a authController.js */

require_once __DIR__ . '/../utils/db.php';
require_once __DIR__ . '/../utils/authUtils.php';
require_once __DIR__ . '/../views/responseFormatter.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../models/usuario.php';

/**
 * Registrar un nuevo usuario
 */
function register() {
    try {
        // Obtener datos del request
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $response = formatError('Datos de registro invu00e1lidos', 400);
            sendResponse($response);
        }
        
        $nombre = $data['nombre'] ?? '';
        $apellido = $data['apellido'] ?? '';
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $telefono = $data['telefono'] ?? '';
        $dni = $data['dni'] ?? '';
        
        // Verificar si el usuario ya existe
        $existingUser = findUserByEmail($email);
        
        if ($existingUser) {
            $response = formatError('El correo electru00f3nico ya estu00e1 registrado', 400);
            sendResponse($response);
        }
        
        // Crear el usuario
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        // Hash de la contraseu00f1a
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
        
        // Iniciar transacciu00f3n
        pg_query($conn, 'BEGIN');
        
        // 1. Crear el usuario
        $userQuery = "INSERT INTO $schema.usuario (nombre, apellido, email, password, rol) 
                  VALUES ($1, $2, $3, $4, $5) 
                  RETURNING usuarioid, nombre, apellido, email, rol";
        
        $userResult = pg_query_params($conn, $userQuery, [$nombre, $apellido, $email, $hashedPassword, 'Beneficiario']);
        
        if (!$userResult) {
            pg_query($conn, 'ROLLBACK');
            throw new Exception(pg_last_error($conn));
        }
        
        $newUser = pg_fetch_assoc($userResult);
        
        // 2. Crear el beneficiario asociado
        $beneficiarioQuery = "INSERT INTO $schema.beneficiario (nombre, apellido, email, telefono, usuarioid, dni) 
                           VALUES ($1, $2, $3, $4, $5, $6)";
        
        $beneficiarioResult = pg_query_params(
            $conn, 
            $beneficiarioQuery, 
            [$nombre, $apellido, $email, $telefono, $newUser['usuarioid'], $dni]
        );
        
        if (!$beneficiarioResult) {
            pg_query($conn, 'ROLLBACK');
            throw new Exception(pg_last_error($conn));
        }
        
        pg_query($conn, 'COMMIT');
        
        // Crear token JWT
        $token = generateJWT([
            'id' => $newUser['usuarioid'],
            'email' => $newUser['email'],
            'rol' => $newUser['rol']
        ]);
        
        // Completar datos del usuario
        $newUser['telefono'] = $telefono;
        $newUser['dni'] = $dni;
        
        $response = formatSuccess(
            [
                'user' => [
                    'id' => $newUser['usuarioid'],
                    'nombre' => $newUser['nombre'],
                    'apellido' => $newUser['apellido'],
                    'email' => $newUser['email'],
                    'rol' => $newUser['rol'],
                    'telefono' => $newUser['telefono'],
                    'dni' => $newUser['dni']
                ],
                'token' => $token
            ],
            'Usuario registrado exitosamente',
            201
        );
        
        pg_close($conn);
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al registrar usuario: ' . $error->getMessage());
        $response = formatError(
            'Error al registrar usuario',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Iniciar sesiu00f3n de usuario
 */
function login() {
    try {
        // Obtener datos del request
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            $response = formatError('Datos de inicio de sesiu00f3n invu00e1lidos', 400);
            sendResponse($response);
        }
        
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        
        // Validar credenciales
        $user = validateCredentials($email, $password);
        
        if (!$user) {
            $response = formatError('Correo electru00f3nico o contraseu00f1a incorrectos', 401);
            sendResponse($response);
        }
        
        // Crear token JWT
        $token = generateJWT([
            'id' => $user['usuarioid'],
            'email' => $user['email'],
            'rol' => $user['rol']
        ]);
        
        $response = formatSuccess(
            [
                'user' => [
                    'id' => $user['usuarioid'],
                    'nombre' => $user['nombre'],
                    'apellido' => $user['apellido'],
                    'email' => $user['email'],
                    'rol' => $user['rol']
                ],
                'token' => $token
            ],
            'Inicio de sesiu00f3n exitoso',
            200
        );
        
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al iniciar sesiu00f3n: ' . $error->getMessage());
        $response = formatError(
            'Error al iniciar sesiu00f3n',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener perfil del usuario
 */
function getProfile() {
    try {
        // El middleware verifyToken ya agregu00f3 la informaciu00f3n del usuario en $_REQUEST['user']
        $userId = $_REQUEST['user']['id'];
        
        // Obtener datos del usuario
        $user = getFullProfileById($userId);
        
        if (!$user) {
            $response = formatError('Usuario no encontrado', 404);
            sendResponse($response);
        }
        
        $response = formatSuccess(
            ['user' => $user],
            'Perfil obtenido exitosamente',
            200
        );
        
        sendResponse($response);
    } catch (Exception $error) {
        error_log('Error al obtener perfil: ' . $error->getMessage());
        $response = formatError(
            'Error al obtener perfil',
            500,
            $error->getMessage()
        );
        sendResponse($response);
    }
}

/**
 * Obtener perfil completo del usuario incluyendo informaciu00f3n de beneficiario
 * @param int $userId ID del usuario
 * @return array|null Datos del perfil o null si no existe
 */
function getFullProfileById($userId) {
    try {
        $conn = getConnection();
        $schema = DB_SCHEMA;
        
        // Primero obtener datos del usuario
        $userResult = findUserById($userId);
        
        if (!$userResult) {
            pg_close($conn);
            return null;
        }
        
        // Obtener datos del beneficiario si existe
        $beneficiarioQuery = "SELECT * FROM $schema.beneficiario WHERE usuarioid = $1";
        $beneficiarioResult = pg_query_params($conn, $beneficiarioQuery, [$userId]);
        
        if (!$beneficiarioResult) {
            throw new Exception(pg_last_error($conn));
        }
        
        $beneficiario = pg_fetch_assoc($beneficiarioResult);
        
        // Si es beneficiario, obtener sus vehu00edculos y pu00f3lizas
        $vehiculos = [];
        $polizas = [];
        
        if ($beneficiario) {
            // Obtener vehu00edculos
            $vehiculosQuery = "SELECT * FROM $schema.vehiculo WHERE beneficiarioid = $1";
            $vehiculosResult = pg_query_params($conn, $vehiculosQuery, [$beneficiario['beneficiarioid']]);
            
            if (!$vehiculosResult) {
                throw new Exception(pg_last_error($conn));
            }
            
            $vehiculos = pg_fetch_all($vehiculosResult) ?: [];
            
            // Obtener pu00f3lizas
            $polizasQuery = "SELECT * FROM $schema.poliza WHERE beneficiarioid = $1";
            $polizasResult = pg_query_params($conn, $polizasQuery, [$beneficiario['beneficiarioid']]);
            
            if (!$polizasResult) {
                throw new Exception(pg_last_error($conn));
            }
            
            $polizas = pg_fetch_all($polizasResult) ?: [];
        }
        
        pg_close($conn);
        
        // Combinar datos
        return [
            'id' => $userResult['usuarioid'],
            'nombre' => $userResult['nombre'],
            'apellido' => $userResult['apellido'],
            'email' => $userResult['email'],
            'rol' => $userResult['rol'],
            'beneficiario' => $beneficiario,
            'vehiculos' => $vehiculos,
            'polizas' => $polizas
        ];
    } catch (Exception $error) {
        error_log('Error al obtener perfil completo: ' . $error->getMessage());
        return null;
    }
} 