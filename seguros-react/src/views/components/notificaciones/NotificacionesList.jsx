import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notificaciones.css';

const NotificacionesList = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simular la carga de notificaciones desde el API
    const fetchNotificaciones = async () => {
      try {
        // En una implementación real, aquí se llamaría al endpoint
        // await api.get('/api/notificaciones')
        
        // Por ahora, usar datos de ejemplo
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const notificacionesEjemplo = [
          {
            id: 1,
            tipo: 'advertencia',
            mensaje: 'Falta elegir una Póliza',
            accion: '/elegir-poliza',
            fecha: new Date()
          },
          {
            id: 2,
            tipo: 'advertencia',
            mensaje: 'Falta registrar un Vehículo',
            accion: '/registrar-vehiculo',
            fecha: new Date()
          }
        ];
        
        setNotificaciones(notificacionesEjemplo);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificaciones();
  }, []);
  
  const handleActionClick = (accion) => {
    navigate(accion);
  };
  
  if (isLoading) {
    return (
      <div className="notificaciones-loading">
        <p>Cargando notificaciones...</p>
      </div>
    );
  }
  
  if (notificaciones.length === 0) {
    return (
      <div className="notificaciones-empty">
        <p>No tienes notificaciones pendientes.</p>
      </div>
    );
  }
  
  return (
    <div className="notificaciones-container">
      <h2 className="notificaciones-title">Notificaciones</h2>
      
      <div className="notificaciones-list">
        {notificaciones.map((notificacion) => (
          <div 
            key={notificacion.id} 
            className={`notificacion-item notificacion-${notificacion.tipo}`}
            onClick={() => handleActionClick(notificacion.accion)}
          >
            <div className="notificacion-content">
              <div className="notificacion-mensaje">
                {notificacion.mensaje}
              </div>
              <div className="notificacion-fecha">
                {new Date(notificacion.fecha).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificacionesList; 