import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PagoForm from '../components/pago/PagoForm';
import './Dashboard.css';

const PagoPolizaPage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { polizaId } = useParams();
  
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
          <h2 className="page-title">Pago de Póliza</h2>
          <p className="page-description">
            Completa la información de pago para finalizar la contratación de tu póliza.
          </p>
          
          <PagoForm />
        </div>
      </main>
    </div>
  );
};

export default PagoPolizaPage; 