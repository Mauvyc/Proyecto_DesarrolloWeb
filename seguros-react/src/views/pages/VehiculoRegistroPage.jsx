import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VehiculoForm from '../components/vehiculo/VehiculoForm';
import './Dashboard.css';

const VehiculoRegistroPage = () => {
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
            Notificaciones (1)
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          <h2 className="page-title">Registrar Vehículo</h2>
          <p className="page-description">
            Completa los datos para registrar un nuevo vehículo en el sistema.
          </p>
          
          <VehiculoForm />
        </div>
      </main>
    </div>
  );
};

export default VehiculoRegistroPage; 