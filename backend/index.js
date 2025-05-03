import express from "express";
import cors from "cors";
import {Pool} from 'pg';
import { FRONTEND_URL, DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT, PORT } from "./config.js";
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
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


