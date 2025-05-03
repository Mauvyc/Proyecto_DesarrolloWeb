import express from "express";
import cors from "cors";
import {Pool} from 'pg';
import { FRONTEND_URL, ALLOWED_ORIGINS, DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, PORT } from "./config.js";
import 'dotenv/config';

const app = express();

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

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});

app.get("/ping", async(req, res) => {
    const result = await pool.query('SELECT NOW()')
    console.log(result)

    res.send(
        {
            pong: result.rows[0].now,
        }
    );
});

app.get("/", (req, res) => {
    res.json({ users: [] });
});

app.listen(PORT, () => {
    console.log('Server is running on port 4000');
});


