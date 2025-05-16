<?php
/** * Utilidades de autenticación * Equivalente a authUtils.js */

require_once __DIR__ . '/../config/config.php';

/**
 * Genera un token JWT
 *
 * @param array $payload Datos para el token
 * @return string Token JWT generado
 */
function generateJWT($payload) {
    $header = json_encode([
        'typ' => 'JWT',
        'alg' => 'HS256'
    ]);
    
    $payload['iat'] = time();
    $payload['exp'] = strtotime(JWT_EXPIRES_IN, $payload['iat']);
    
    $header_encoded = base64UrlEncode($header);
    $payload_encoded = base64UrlEncode(json_encode($payload));
    
    $signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", JWT_SECRET, true);
    $signature_encoded = base64UrlEncode($signature);
    
    return "$header_encoded.$payload_encoded.$signature_encoded";
}

/** * Verifica un token JWT * * @param string $token Token JWT a verificar * @return array|false Payload decodificado o false si es invu00e1lido */
function verifyJWT($token) {
    $parts = explode('.', $token);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    list($header_encoded, $payload_encoded, $signature_encoded) = $parts;
    
    $signature = base64UrlDecode($signature_encoded);
    $expected_signature = hash_hmac('sha256', "$header_encoded.$payload_encoded", JWT_SECRET, true);
    
    if (!hash_equals($expected_signature, $signature)) {
        return false;
    }
    
    $payload = json_decode(base64UrlDecode($payload_encoded), true);
    
    if (!$payload) {
        return false;
    }
    
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        return false;
    }
    
    return $payload;
}

/** * Middleware para verificar token JWT * * @return mixed Si el token es vu00e1lido, devuelve el payload en $_REQUEST['user'] */
function verifyToken() {
    // Obtener el token de los headers
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (empty($authHeader) || !preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'No se proporcionu00f3 token de autenticaciu00f3n'
        ]);
        exit;
    }
    
    $token = $matches[1];
    $payload = verifyJWT($token);
    
    if (!$payload) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Token invu00e1lido o expirado'
        ]);
        exit;
    }
    
    // Almacenar la informaciu00f3n del usuario para el controlador
    $_REQUEST['user'] = $payload;
    return true;
}

/**
 * Codifica en Base64 URL-safe
 *
 * @param string $data Datos a codificar
 * @return string Datos codificados
 */
function base64UrlEncode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/**
 * Decodifica Base64 URL-safe
 *
 * @param string $data Datos a decodificar
 * @return string Datos decodificados
 */
function base64UrlDecode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/'));
} 