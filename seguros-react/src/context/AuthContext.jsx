import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Verificar si hay un token en localStorage
        if (authService.isAuthenticated()) {
          // Obtener usuario del localStorage inicialmente
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
          
          // Verificar con el servidor si el token es válido
          try {
            const { data } = await authService.getProfile();
            setUser(data.user);
          } catch (profileError) {
            // Si hay un error al obtener el perfil, el token podría ser inválido
            console.error("Error al verificar el perfil:", profileError);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        setError(err.message || "Error al verificar la autenticación");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Función para registro
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para login
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      setIsAuthenticated(true);
      return response;
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para logout
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Contexto que se proporcionará
  const authContextValue = {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext; 