import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo-container">
          <div className="logo-wrapper">
            <span className="auth-logo-icon">🚗</span>
            <h1 className="auth-logo-text">SegurosFlex</h1>
          </div>
        </div>
        
        <div className="auth-content">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 