import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import { verifyToken } from '../utils/authUtils.js';

const router = Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);
router.get('/profile', verifyToken, getProfile);

export default router; 