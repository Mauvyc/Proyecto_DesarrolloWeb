import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./views/pages/LoginPage";
import RegisterPage from "./views/pages/RegisterPage";
import Dashboard from "./views/pages/Dashboard";
import HomePage from "./views/pages/HomePage";
import ForgotPasswordPage from "./views/pages/ForgotPasswordPage";
import PolizaSelectionPage from "./views/pages/PolizaSelectionPage";
import VehiculoRegistroPage from "./views/pages/VehiculoRegistroPage";
import PagoPolizaPage from "./views/pages/PagoPolizaPage";
import NotificacionesPage from "./views/pages/NotificacionesPage";
import "./views/styles/App.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Componente protegido que verifica autenticación
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mostrar carga mientras verificamos el estado de autenticación
  if (isLoading) {
    return <div className="loading">Verificando autenticación...</div>;
  }
  
  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Si está autenticado, mostrar el componente hijo
  return children;
};

// Componente que redirige usuarios autenticados desde rutas públicas
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Mostrar carga mientras verificamos el estado de autenticación
  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }
  
  // Si ya está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Si no está autenticado, mostrar el componente hijo
  return children;
};

function AppRoutes() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="loading">Cargando aplicación...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/registro" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />
      <Route path="/recuperar-contrasena" element={
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/elegir-poliza" element={
        <ProtectedRoute>
          <PolizaSelectionPage />
        </ProtectedRoute>
      } />
      <Route path="/registrar-vehiculo" element={
        <ProtectedRoute>
          <VehiculoRegistroPage />
        </ProtectedRoute>
      } />
      <Route path="/pago-poliza/:polizaId" element={
        <ProtectedRoute>
          <PagoPolizaPage />
        </ProtectedRoute>
      } />
      <Route path="/notificaciones" element={
        <ProtectedRoute>
          <NotificacionesPage />
        </ProtectedRoute>
      } />
      {/* Ruta por defecto para manejar rutas inexistentes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const [currentTime, setCurrentTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServerTime = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/ping`);
      const data = await res.json();
      setCurrentTime(data.pong);
    } catch (err) {
      setError("No pudimos conectar con el servidor. Intente más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Llamar al servidor al cargar la página
    fetchServerTime();
  }, []);

  // Características de seguros
  const features = [
    {
      id: 1,
      icon: "🛡️",
      title: "Cobertura Total",
      description: "Protección ante cualquier siniestro."
    },
    {
      id: 2,
      icon: "📞",
      title: "Atención 24/7",
      description: "Siempre disponibles para ayudarte."
    },
    {
      id: 3,
      icon: "🚗",
      title: "Auto de Reemplazo",
      description: "No te quedes sin movilidad."
    },
    {
      id: 4,
      icon: "👨‍💼",
      title: "Asesoría Personalizada",
      description: "Un agente especializado para ti."
    }
  ];

  // Testimonios de clientes
  const testimonials = [
    {
      id: 1,
      name: "Carlos M.",
      text: "Gracias a SegurosFlex recibí un auto de reemplazo en menos de 24 horas.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      emoji: "🚗"
    },
    {
      id: 2,
      name: "Ana R.",
      text: "Mi reclamo fue procesado sin problemas y obtuve mi indemnización muy rápido.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      emoji: "💰"
    },
    {
      id: 3,
      name: "Luis P.",
      text: "Me asistieron cuando más lo necesitaba, excelente servicio!",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      emoji: "⭐"
    }
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      id: 1,
      question: "¿Qué cubre el seguro de auto?",
      answer: "Nuestro seguro de auto cubre daños por accidentes, robo, responsabilidad civil, asistencia en viaje y más. Cada plan puede personalizarse según tus necesidades específicas."
    },
    {
      id: 2,
      question: "¿Cómo hacer un reclamo?",
      answer: "Puedes hacer un reclamo llamando a nuestra línea 24/7, a través de nuestra app móvil o en nuestra página web. Un asesor te guiará en todo el proceso hasta la resolución."
    },
    {
      id: 3,
      question: "¿Cuáles son los métodos de pago?",
      answer: "Aceptamos tarjetas de crédito/débito, transferencias bancarias, pagos en efectivo en nuestras oficinas y financiamiento en cuotas sin interés."
    }
  ];

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
