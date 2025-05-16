import axios from 'axios';

// URL del backend según el entorno
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 
                    (window.location.hostname === 'localhost' 
                      ? 'http://localhost:4000'
                      : 'https://backend-web2.onrender.com'); // URL actualizada al nuevo backend

console.log('Backend URL:', BACKEND_URL);

// Tiempo máximo de espera para las solicitudes (20 segundos)
const TIMEOUT = 20000;

// Crear una instancia de Axios
const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar tokens expirados o inválidos
    if (error.response && error.response.status === 401) {
      // Si estamos en una ruta protegida y el token es inválido, cerrar sesión
      if (error.config.url !== '/api/auth/login') {
        // Limpiar datos de autenticación
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirigir a la página de login si estamos en una página protegida
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Formato estandarizado de errores
    const errorData = {
      message: error.response?.data?.message || 'Error en la solicitud',
      status: error.response?.status,
      details: error.response?.data || error.message,
    };
    
    return Promise.reject(errorData);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar un nuevo usuario
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      // Guardar el token automáticamente tras registro exitoso
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      // Guardar el token en localStorage
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Opcional: Realizar una petición al backend para invalidar el token en el servidor
    // api.post('/api/auth/logout').catch(() => {});
  },
  
  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Verificar si el token es válido (útil para proteger rutas)
  checkToken: async () => {
    if (!authService.isAuthenticated()) {
      return false;
    }
    
    try {
      const response = await api.get('/api/auth/profile');
      return !!response.data.success;
    } catch (error) {
      authService.logout();
      return false;
    }
  }
};

// Servicios para gestionar pólizas
export const polizaService = {
  // Obtener todas las pólizas disponibles
  getPolizasDisponibles: async () => {
    try {
      const response = await api.get('/api/polizas/disponibles');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Seleccionar una póliza
  seleccionarPoliza: async (polizaId) => {
    try {
      const response = await api.post(`/api/polizas/seleccionar/${polizaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener las pólizas del usuario
  getPolizasUsuario: async () => {
    try {
      const response = await api.get('/api/polizas/usuario');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener detalles de una póliza específica
  getPolizaById: async (polizaId) => {
    try {
      const response = await api.get(`/api/polizas/${polizaId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar vehículos
export const vehiculoService = {
  // Registrar un nuevo vehículo
  registrarVehiculo: async (vehiculoData) => {
    try {
      const response = await api.post('/api/vehiculos', vehiculoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener vehículos del usuario
  getVehiculosUsuario: async () => {
    try {
      const response = await api.get('/api/vehiculos/usuario');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener detalles de un vehículo específico
  getVehiculoById: async (vehiculoId) => {
    try {
      const response = await api.get(`/api/vehiculos/${vehiculoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Actualizar vehículo
  updateVehiculo: async (vehiculoId, vehiculoData) => {
    try {
      const response = await api.put(`/api/vehiculos/${vehiculoId}`, vehiculoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar vehículo
  deleteVehiculo: async (vehiculoId) => {
    try {
      const response = await api.delete(`/api/vehiculos/${vehiculoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar pagos
export const pagoService = {
  // Procesar un pago
  procesarPago: async (pagoData) => {
    try {
      const response = await api.post('/api/pagos', pagoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener historial de pagos
  getHistorialPagos: async () => {
    try {
      const response = await api.get('/api/pagos/historial');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Obtener detalle de un pago específico
  getPagoById: async (pagoId) => {
    try {
      const response = await api.get(`/api/pagos/${pagoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Servicios para gestionar notificaciones
export const notificacionService = {
  // Obtener notificaciones del usuario
  getNotificaciones: async () => {
    try {
      const response = await api.get('/api/notificaciones');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Marcar notificación como leída
  marcarLeida: async (notificacionId) => {
    try {
      const response = await api.put(`/api/notificaciones/${notificacionId}/marcar-leida`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Eliminar notificación
  deleteNotificacion: async (notificacionId) => {
    try {
      const response = await api.delete(`/api/notificaciones/${notificacionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api; 