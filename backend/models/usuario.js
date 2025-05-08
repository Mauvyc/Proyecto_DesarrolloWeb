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

  // Crear un nuevo usuario y beneficiario
  async create(userData) {
    const { nombre, apellido, email, password, telefono = '', dni = '' } = userData;
    
    // Hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Iniciar transacción para garantizar consistencia
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // 1. Crear el usuario
      const userResult = await client.query(
        `INSERT INTO ${DB_SCHEMA}.usuario (nombre, apellido, email, password, rol) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING usuarioid, nombre, apellido, email, rol`,
        [nombre, apellido, email, hashedPassword, 'Beneficiario']
      );
      
      const newUser = userResult.rows[0];
      
      // 2. Crear el beneficiario asociado
      await client.query(
        `INSERT INTO ${DB_SCHEMA}.beneficiario (nombre, apellido, email, telefono, usuarioid, dni) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [nombre, apellido, email, telefono, newUser.usuarioid, dni]
      );
      
      await client.query('COMMIT');
      
      // Completar la información del usuario con los datos del beneficiario
      newUser.telefono = telefono;
      newUser.dni = dni;
      
      return newUser;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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

  // Buscar beneficiario por ID de usuario
  async getBeneficiarioByUserId(userId) {
    const result = await pool.query(
      `SELECT * FROM ${DB_SCHEMA}.beneficiario WHERE usuarioid = $1`,
      [userId]
    );
    return result.rows[0];
  }
  
  // Obtener perfil completo del usuario incluyendo información de beneficiario
  async getFullProfile(userId) {
    // Primero obtener datos del usuario
    const userResult = await this.findById(userId);
    
    if (!userResult) {
      return null;
    }
    
    // Obtener datos del beneficiario si existe
    const beneficiarioResult = await pool.query(
      `SELECT * FROM ${DB_SCHEMA}.beneficiario WHERE usuarioid = $1`,
      [userId]
    );
    
    const beneficiario = beneficiarioResult.rows[0] || null;
    
    // Si es beneficiario, obtener sus vehículos y pólizas
    let vehiculos = [];
    let polizas = [];
    
    if (beneficiario) {
      // Obtener vehículos
      const vehiculosResult = await pool.query(
        `SELECT * FROM ${DB_SCHEMA}.vehiculo WHERE beneficiarioid = $1`,
        [beneficiario.beneficiarioid]
      );
      vehiculos = vehiculosResult.rows;
      
      // Obtener pólizas
      const polizasResult = await pool.query(
        `SELECT * FROM ${DB_SCHEMA}.poliza WHERE beneficiarioid = $1`,
        [beneficiario.beneficiarioid]
      );
      polizas = polizasResult.rows;
    }
    
    return {
      ...userResult,
      beneficiario,
      vehiculos,
      polizas
    };
  }
}

export default new UsuarioModel(); 