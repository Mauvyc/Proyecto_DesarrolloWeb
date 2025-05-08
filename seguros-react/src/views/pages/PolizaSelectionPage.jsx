import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PolizaSelectionForm from '../components/poliza/PolizaSelectionForm';
import './Dashboard.css';

const PolizaSelectionPage = () => {
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
          <button className="notifications-button" onClick={() => navigate('/notificaciones')}>
            Notificaciones (2)
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          <h2 className="page-title">Selecciona tu póliza</h2>
          <p className="page-description">
            Elige la póliza que mejor se adapte a tus necesidades y presupuesto.
          </p>
          
          <PolizaSelectionForm />
        </div>
      </main>
    </div>
  );
};

export default PolizaSelectionPage; 