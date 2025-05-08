import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificacionesList from '../components/notificaciones/NotificacionesList';
import './Dashboard.css';

const NotificacionesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span className="logo-icon">🚗</span>
          <h1>SeguroFlex</h1>
        </div>
        
        <div className="dashboard-actions">
          <button className="profile-button" onClick={() => navigate('/perfil')}>
            Ver Perfil
          </button>
          <button className="dashboard-button" onClick={() => navigate('/dashboard')}>
            Panel General
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          <h2 className="page-title">Notificaciones</h2>
          <p className="page-description">
            Revisa y gestiona tus notificaciones pendientes.
          </p>
          
          <NotificacionesList />
        </div>
      </main>
    </div>
  );
};

export default NotificacionesPage; 