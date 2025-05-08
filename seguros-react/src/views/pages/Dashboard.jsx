import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  if (!user) {
    return <div className="loading">Cargando...</div>;
  }
  
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-logo">
          <span className="dashboard-logo-icon">🚗</span>
          <h1 className="dashboard-logo-text">SegurosFlex</h1>
        </div>
        
        <div className="dashboard-user">
          <span className="user-greeting">Hola, {user.nombre}</span>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="user-avatar">👤</span>
          </button>
          
          <div className={`user-menu ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-header">
              <span className="menu-username">{user.nombre} {user.apellido}</span>
              <span className="menu-email">{user.email}</span>
            </div>
            <ul className="menu-items">
              <li><button className="menu-item">Mi Perfil</button></li>
              <li><button className="menu-item">Mis Seguros</button></li>
              <li><button className="menu-item">Configuración</button></li>
              <li><button className="menu-item logout" onClick={handleLogout}>Cerrar Sesión</button></li>
            </ul>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Bienvenido a tu panel de control</h2>
          <p>Desde aquí podrás gestionar tus pólizas y reclamaciones de manera fácil y rápida.</p>
        </div>
        
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Mis Pólizas</h3>
            <p>Gestiona tus pólizas activas y revisa su estado.</p>
            <button className="card-action">Ver Pólizas</button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">⚠️</div>
            <h3>Reportar Siniestro</h3>
            <p>Reporta un siniestro y sigue el proceso en línea.</p>
            <button className="card-action">Reportar</button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Pagos</h3>
            <p>Consulta y realiza pagos de tus pólizas.</p>
            <button className="card-action">Ver Pagos</button>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">📞</div>
            <h3>Atención al Cliente</h3>
            <p>Contacta con un asesor para resolver tus dudas.</p>
            <button className="card-action">Contactar</button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 SegurosFlex - Todos los derechos reservados.</p>
        <p><Link to="/">Volver al inicio</Link></p>
      </footer>
    </div>
  );
};

export default Dashboard; 