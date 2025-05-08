import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Pago.css';

const PagoForm = () => {
  const { polizaId } = useParams();
  const navigate = useNavigate();
  
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Datos de ejemplo de la póliza seleccionada
  const polizaInfo = {
    tipo: 'Premium',
    costo: 500,
    moneda: 'S/'
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear tarjeta de crédito
    if (name === 'number') {
      // Solo permitir números y formatear con espacios cada 4 dígitos
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
        .substr(0, 19);
      
      setCardData({
        ...cardData,
        [name]: formattedValue
      });
    } else if (name === 'expiry') {
      // Formatear fecha de expiración (MM/AA)
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(?=\d)/g, '$1/')
        .substr(0, 5);
      
      setCardData({
        ...cardData,
        [name]: formattedValue
      });
    } else if (name === 'cvc') {
      // Solo permitir números para el CVC (3 dígitos)
      const formattedValue = value
        .replace(/\D/g, '')
        .substr(0, 3);
      
      setCardData({
        ...cardData,
        [name]: formattedValue
      });
    } else {
      setCardData({
        ...cardData,
        [name]: value
      });
    }
    
    // Limpiar errores al editar
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Número de tarjeta inválido';
    }
    
    if (!cardData.expiry || cardData.expiry.length < 5) {
      newErrors.expiry = 'Fecha de expiración inválida';
    }
    
    if (!cardData.cvc || cardData.cvc.length < 3) {
      newErrors.cvc = 'CVC inválido';
    }
    
    if (!cardData.name) {
      newErrors.name = 'El nombre del titular es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulamos una petición al servidor para procesar el pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir al dashboard después del pago exitoso
      navigate('/dashboard?pagoExitoso=true');
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="pago-container">
      <div className="pago-header">
        <h2>Detalles de Pago</h2>
        <div className="poliza-seleccionada">
          <p>Has seleccionado: <strong>{polizaInfo.tipo}</strong></p>
          <p className="poliza-precio">{polizaInfo.moneda}{polizaInfo.costo}/mes</p>
        </div>
      </div>
      
      <form className="pago-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre del titular</label>
          <input
            type="text"
            id="name"
            name="name"
            value={cardData.name}
            onChange={handleChange}
            placeholder="Nombre como aparece en la tarjeta"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="number">Número de tarjeta</label>
          <input
            type="text"
            id="number"
            name="number"
            value={cardData.number}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className={errors.number ? 'error' : ''}
          />
          {errors.number && <span className="error-message">{errors.number}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiry">MM/AA</label>
            <input
              type="text"
              id="expiry"
              name="expiry"
              value={cardData.expiry}
              onChange={handleChange}
              placeholder="MM/AA"
              className={errors.expiry ? 'error' : ''}
            />
            {errors.expiry && <span className="error-message">{errors.expiry}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="cvc">CVC</label>
            <input
              type="text"
              id="cvc"
              name="cvc"
              value={cardData.cvc}
              onChange={handleChange}
              placeholder="123"
              className={errors.cvc ? 'error' : ''}
            />
            {errors.cvc && <span className="error-message">{errors.cvc}</span>}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="pago-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Procesando pago...' : `Pagar por Póliza ${polizaInfo.tipo}`}
        </button>
      </form>
    </div>
  );
};

export default PagoForm; 