import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Variables de entorno con valores por defecto
export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;

// Base de datos
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_SCHEMA = process.env.DB_SCHEMA;
export const DB_SSL = process.env.DB_SSL === 'false' ? false : true;

// JWT (JSON Web Token)
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// CORS
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const ALLOWED_ORIGINS = [
    FRONTEND_URL
];

// Exportar un objeto con todas las configuraciones
export default {
    PORT,
    NODE_ENV,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_SCHEMA,
    DB_SSL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    FRONTEND_URL,
    ALLOWED_ORIGINS
}; 