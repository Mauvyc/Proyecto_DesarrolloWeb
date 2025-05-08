import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AuthForms.css';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      // Aquí implementaríamos la lógica para enviar el enlace de recuperación
      // Por ahora, simulamos una respuesta exitosa después de un pequeño retraso
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);
      setMessage('Enlace de recuperación enviado. Por favor, revisa tu correo electrónico.');
    } catch (error) {
      setIsSuccess(false);
      setMessage('Error al enviar el enlace de recuperación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Recuperar Contraseña</h2>
      
      {message && (
        <div className={`auth-message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa tu correo electrónico"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="auth-button"
          disabled={isSubmitting || !email}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar enlace de recuperación'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>
          <Link to="/login">Volver a Iniciar Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 