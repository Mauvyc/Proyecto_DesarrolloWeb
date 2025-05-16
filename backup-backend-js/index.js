import express from "express";
import cors from "cors";
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar configuración
import { FRONTEND_URL, ALLOWED_ORIGINS, PORT, DB_HOST, DB_USER, DB_DATABASE, DB_PORT, DB_SCHEMA } from "./config/config.js";

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';

// Importar formateador de respuestas
import ResponseFormatter from './views/responseFormatter.js';

// Obtener el directorio actual (necesario para ESM)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS para permitir múltiples orígenes
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como aplicaciones móviles o curl)
        if (!origin) return callback(null, true);
        
        // Verificar si el origen está en la lista de permitidos
        if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log("Origen bloqueado por CORS:", origin);
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true // Permitir cookies en solicitudes cross-origin
}));

// Ruta principal
app.get("/", (req, res) => {
    const response = ResponseFormatter.success(
        { message: "API funcionando correctamente", version: "1.0" },
        "Bienvenido a la API de SegurosFlex",
        200
    );
    ResponseFormatter.send(res, response);
});

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta específica para el favicon.ico para evitar error 404
app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

// COMENTANDO TEMPORALMENTE LA RUTA PROBLEMÁTICA
// Manejar cualquier otra ruta para SPA (Single Page Application)
// app.get('/:path*?', (req, res) => {
//    res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en la aplicación:', err.stack);
    
    const response = ResponseFormatter.error(
        process.env.NODE_ENV === 'production' ? 'Se produjo un error inesperado' : err.message,
        500,
        err
    );
    
    ResponseFormatter.send(res, response);
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    const response = ResponseFormatter.error(
        'Ruta no encontrada',
        404
    );
    
    ResponseFormatter.send(res, response);
});

// Iniciar el servidor
const PORT_NUMBER = PORT || 4000;
app.listen(PORT_NUMBER, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT_NUMBER}`);
    console.log(`URL frontend: ${FRONTEND_URL}`);
    
    // Imprimir información de configuración de BD para debugging
    console.log('Configuración de base de datos:');
    console.log(`- Host: ${DB_HOST}`);
    console.log(`- Puerto: ${DB_PORT}`);
    console.log(`- DB: ${DB_DATABASE}`);
    console.log(`- Usuario: ${DB_USER}`);
    console.log(`- Esquema: ${DB_SCHEMA || 'public'}`);
});

export default app; 