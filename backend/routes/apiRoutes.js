import { Router } from 'express';
import { ping } from '../controllers/pingController.js';
import { getAllUsers } from '../controllers/userController.js';
import { crearPoliza, getPolizasByBeneficiario, getPolizaById } from '../controllers/polizaController.js';
import { registrarVehiculo, getVehiculosByBeneficiario, getVehiculoById } from '../controllers/vehiculoController.js';
import { registrarPago, getPagosByPresupuesto } from '../controllers/pagoController.js';
import { getNotificaciones } from '../controllers/notificacionController.js';
import { verifyToken } from '../utils/authUtils.js';

const router = Router();

// Rutas generales de la API
router.get('/ping', ping);
router.get('/users', verifyToken, getAllUsers);

// Rutas de pólizas
router.post('/polizas', verifyToken, crearPoliza);
router.get('/polizas/beneficiario/:beneficiarioId', verifyToken, getPolizasByBeneficiario);
router.get('/polizas/:polizaId', verifyToken, getPolizaById);

// Rutas de vehículos
router.post('/vehiculos', verifyToken, registrarVehiculo);
router.get('/vehiculos/beneficiario/:beneficiarioId', verifyToken, getVehiculosByBeneficiario);
router.get('/vehiculos/:vehiculoId', verifyToken, getVehiculoById);

// Rutas de pagos
router.post('/pagos', verifyToken, registrarPago);
router.get('/pagos/presupuesto/:presupuestoId', verifyToken, getPagosByPresupuesto);

// Rutas de notificaciones
router.get('/notificaciones', verifyToken, getNotificaciones);

export default router; 