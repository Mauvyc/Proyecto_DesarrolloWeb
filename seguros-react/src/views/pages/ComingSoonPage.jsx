import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const ComingSoonPage = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="dashboard-container">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <h1>SegurosFlex</h1>
        </div>
        
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Volver al Panel
        </button>
      </header>
      
      <main className="main-content coming-soon-content">
        <div className="coming-soon-container">
          <div className="coming-soon-icon">🚧</div>
          <h2>{title || 'Próximamente'}</h2>
          <p>Esta funcionalidad estará disponible próximamente</p>
          <button 
            className="back-to-dashboard-button"
            onClick={() => navigate('/dashboard')}
          >
            Volver al Panel de Control
          </button>
        </div>
      </main>
    </div>
  );
};

export default ComingSoonPage; 