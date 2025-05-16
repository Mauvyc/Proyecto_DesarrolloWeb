import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario no está autenticado, redirigir al login
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  // Manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Funciones para navegar a las diferentes secciones
  const irAPolizas = () => navigate('/mis-polizas');
  const irAReportarSiniestro = () => navigate('/reportar-siniestro');
  const irAPagos = () => navigate('/pagos');
  const irAContacto = () => navigate('/atencion-cliente');
  
  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <h1>SegurosFlex</h1>
        </div>
        
        <div className="user-info">
          <span>Hola, {user.nombre} {user.apellido}</span>
          <div className="user-actions">
            <button className="profile-button">
              <span className="profile-icon">👤</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="main-content">
        <div className="welcome-banner">
          <h2>Bienvenido a tu panel de control</h2>
          <p>Desde aquí podrás gestionar tus pólizas y reclamaciones de manera fácil y rápida.</p>
        </div>
        
        <div className="cards-grid">
          {/* Mis Pólizas */}
          <div className="card">
            <div className="card-icon">
              <span>📋</span>
            </div>
            <div className="card-content">
              <h3>Mis Pólizas</h3>
              <p>Gestiona tus pólizas activas y revisa su estado.</p>
              <button className="card-button" onClick={irAPolizas}>Ver Pólizas</button>
            </div>
          </div>
          
          {/* Reportar Siniestro */}
          <div className="card">
            <div className="card-icon">
              <span>⚠️</span>
            </div>
            <div className="card-content">
              <h3>Reportar Siniestro</h3>
              <p>Reporta un siniestro y sigue el proceso en línea.</p>
              <button className="card-button" onClick={irAReportarSiniestro}>Reportar</button>
            </div>
          </div>
          
          {/* Pagos */}
          <div className="card">
            <div className="card-icon">
              <span>💰</span>
            </div>
            <div className="card-content">
              <h3>Pagos</h3>
              <p>Consulta y realiza pagos de tus pólizas.</p>
              <button className="card-button" onClick={irAPagos}>Ver Pagos</button>
            </div>
          </div>
          
          {/* Atención al Cliente */}
          <div className="card">
            <div className="card-icon">
              <span>📞</span>
            </div>
            <div className="card-content">
              <h3>Atención al Cliente</h3>
              <p>Contacta con un asesor para resolver tus dudas.</p>
              <button className="card-button" onClick={irAContacto}>Contactar</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 