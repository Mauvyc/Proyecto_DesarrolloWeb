import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Vehiculo.css';

const VehiculoForm = () => {
  const [formData, setFormData] = useState({
    placa: '',
    marca: '',
    modelo: '',
    tipo: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const tiposVehiculo = [
    { value: 'sedan', label: 'Sedán' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'pickup', label: 'Pickup' },
    { value: 'deportivo', label: 'Deportivo' }
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores al editar
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.placa) {
      errors.placa = 'La placa es obligatoria';
    }
    
    if (!formData.marca) {
      errors.marca = 'La marca es obligatoria';
    }
    
    if (!formData.modelo) {
      errors.modelo = 'El modelo es obligatorio';
    }
    
    if (!formData.tipo) {
      errors.tipo = 'El tipo de vehículo es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Aquí implementaríamos la lógica para registrar el vehículo
      // usando el API que ya has creado
      console.log('Registrando vehículo:', formData);
      
      // Simular una espera de respuesta del servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navegar al dashboard después del registro exitoso
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al registrar vehículo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="vehiculo-form-container">
      <div className="vehiculo-form-header">
        <h2 className="vehiculo-form-title">Registrar Vehículo</h2>
        <p className="vehiculo-form-description">Completa los datos para registrar un nuevo vehículo.</p>
      </div>
      
      <form className="vehiculo-form" onSubmit={handleSubmit}>
        <div className="vehiculo-form-group">
          <label htmlFor="placa">Placa</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            placeholder="ABC-123"
            className={formErrors.placa ? 'error' : ''}
          />
          {formErrors.placa && <span className="error-message">{formErrors.placa}</span>}
          <small className="field-hint">Este campo es obligatorio.</small>
        </div>
        
        <div className="vehiculo-form-group">
          <label htmlFor="marca">Marca</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Toyota, Nissan..."
            className={formErrors.marca ? 'error' : ''}
          />
          {formErrors.marca && <span className="error-message">{formErrors.marca}</span>}
          <small className="field-hint">Este campo es obligatorio.</small>
        </div>
        
        <div className="vehiculo-form-group">
          <label htmlFor="modelo">Modelo</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Corolla, Sentra..."
            className={formErrors.modelo ? 'error' : ''}
          />
          {formErrors.modelo && <span className="error-message">{formErrors.modelo}</span>}
          <small className="field-hint">Este campo es obligatorio.</small>
        </div>
        
        <div className="vehiculo-form-group">
          <label htmlFor="tipo">Tipo de Vehículo</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={formErrors.tipo ? 'error' : ''}
          >
            <option value="">Seleccione un tipo</option>
            {tiposVehiculo.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
          {formErrors.tipo && <span className="error-message">{formErrors.tipo}</span>}
          <small className="field-hint">Este campo es obligatorio.</small>
        </div>
        
        <button 
          type="submit" 
          className="vehiculo-submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando Vehículo...' : 'Registrar Vehículo'}
        </button>
      </form>
    </div>
  );
};

export default VehiculoForm; 