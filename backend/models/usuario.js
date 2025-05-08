import { pool } from '../utils/db.js';
import bcrypt from 'bcrypt';
import { DB_SCHEMA } from '../config/config.js';

class UsuarioModel {
  // Buscar usuario por email
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM ${DB_SCHEMA}.usuario WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  // Buscar usuario por ID
  async findById(id) {
    const result = await pool.query(
      `SELECT usuarioid, nombre, apellido, email, rol FROM ${DB_SCHEMA}.usuario WHERE usuarioid = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Crear un nuevo usuario
  async create(userData) {
    const { nombre, apellido, email, password } = userData;
    
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const result = await pool.query(
      `INSERT INTO ${DB_SCHEMA}.usuario (nombre, apellido, email, password, rol) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING usuarioid, nombre, apellido, email, rol`,
      [nombre, apellido, email, hashedPassword, 'Beneficiario']
    );
    
    return result.rows[0];
  }

  // Validar credenciales de usuario
  async validateCredentials(email, password) {
    const user = await this.findByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }
}

export default new UsuarioModel(); 