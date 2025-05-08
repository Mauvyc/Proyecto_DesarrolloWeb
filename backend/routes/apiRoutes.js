import { Router } from 'express';
import { ping } from '../controllers/pingController.js';
import { getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../utils/authUtils.js';

const router = Router();

// Rutas generales de la API
router.get('/ping', ping);
router.get('/users', verifyToken, getAllUsers);

export default router; 