import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Poliza.css';

const PolizaSelectionForm = () => {
  const [selectedPoliza, setSelectedPoliza] = useState(null);
  const navigate = useNavigate();
  
  const polizas = [
    {
      id: 1,
      tipo: 'Básica',
      descripcion: 'Cobertura básica con beneficios esenciales para ti.',
      costo: 100,
      moneda: 'S/'
    },
    {
      id: 2,
      tipo: 'Normal',
      descripcion: 'Cobertura intermedia con mayores beneficios y atención preferencial.',
      costo: 250,
      moneda: 'S/'
    },
    {
      id: 3,
      tipo: 'Premium',
      descripcion: 'Cobertura premium con atención personalizada y todos los beneficios.',
      costo: 500,
      moneda: 'S/'
    }
  ];
  
  const handleSelectPoliza = (poliza) => {
    setSelectedPoliza(poliza);
  };
  
  const handleContinue = () => {
    if (selectedPoliza) {
      // Navegar a la página de pago con la póliza seleccionada
      navigate(`/pago-poliza/${selectedPoliza.id}`);
    }
  };
  
  return (
    <div className="poliza-selection-container">
      <h2 className="poliza-selection-title">Elige tu Póliza</h2>
      
      <div className="poliza-cards-container">
        {polizas.map((poliza) => (
          <div 
            key={poliza.id} 
            className={`poliza-card ${selectedPoliza?.id === poliza.id ? 'selected' : ''}`}
            onClick={() => handleSelectPoliza(poliza)}
          >
            <h3 className="poliza-tipo">Póliza {poliza.tipo}</h3>
            <p className="poliza-descripcion">{poliza.descripcion}</p>
            <p className="poliza-precio">
              Costo: <span className="precio">{poliza.moneda}{poliza.costo}</span> / mes
            </p>
            <button 
              className={`poliza-select-button ${selectedPoliza?.id === poliza.id ? 'selected' : ''}`}
              onClick={() => handleSelectPoliza(poliza)}
            >
              Elegir Póliza
            </button>
          </div>
        ))}
      </div>
      
      {selectedPoliza && (
        <div className="selected-poliza-info">
          <p>Has seleccionado: <strong>Póliza {selectedPoliza.tipo}</strong></p>
          <button 
            className="poliza-continue-button"
            onClick={handleContinue}
          >
            Continuar con el pago
          </button>
        </div>
      )}
    </div>
  );
};

export default PolizaSelectionForm; 