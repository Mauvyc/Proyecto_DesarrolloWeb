import jwt from 'jsonwebtoken';
import usuarioModel from '../models/usuario.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config.js';
import ResponseFormatter from '../views/responseFormatter.js';

// Controlador para registro de usuario
export const register = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;
        
        // Verificar si el usuario ya existe
        const existingUser = await usuarioModel.findByEmail(email);
        
        if (existingUser) {
            const response = ResponseFormatter.error(
                "El correo electrónico ya está registrado",
                400
            );
            return ResponseFormatter.send(res, response);
        }
        
        // Crear el usuario
        const newUser = await usuarioModel.create({ nombre, apellido, email, password });
        
        // Crear token JWT
        const token = jwt.sign(
            { id: newUser.usuarioid, email: newUser.email, rol: newUser.rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        const response = ResponseFormatter.success(
            {
                user: {
                    id: newUser.usuarioid,
                    nombre: newUser.nombre,
                    apellido: newUser.apellido,
                    email: newUser.email,
                    rol: newUser.rol
                },
                token
            },
            "Usuario registrado exitosamente",
            201
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        const response = ResponseFormatter.error(
            "Error al registrar usuario",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para login de usuario
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validar credenciales
        const user = await usuarioModel.validateCredentials(email, password);
        
        if (!user) {
            const response = ResponseFormatter.error(
                "Correo electrónico o contraseña incorrectos",
                401
            );
            return ResponseFormatter.send(res, response);
        }
        
        // Crear token JWT
        const token = jwt.sign(
            { id: user.usuarioid, email: user.email, rol: user.rol },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );
        
        const response = ResponseFormatter.success(
            {
                user: {
                    id: user.usuarioid,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    rol: user.rol
                },
                token
            },
            "Inicio de sesión exitoso",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        const response = ResponseFormatter.error(
            "Error al iniciar sesión",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
};

// Controlador para obtener perfil del usuario
export const getProfile = async (req, res) => {
    try {
        const user = await usuarioModel.findById(req.user.id);
        
        if (!user) {
            const response = ResponseFormatter.error(
                "Usuario no encontrado",
                404
            );
            return ResponseFormatter.send(res, response);
        }
        
        const response = ResponseFormatter.success(
            {
                user
            },
            "Perfil obtenido exitosamente",
            200
        );
        
        return ResponseFormatter.send(res, response);
    } catch (error) {
        console.error("Error al obtener perfil:", error);
        const response = ResponseFormatter.error(
            "Error al obtener perfil",
            500,
            error.message
        );
        return ResponseFormatter.send(res, response);
    }
}; 