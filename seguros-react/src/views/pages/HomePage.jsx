import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../styles/HomePage.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

function HomePage() {
  const [currentTime, setCurrentTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchServerTime = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BACKEND_URL}/ping`);
      const data = await res.json();
      setCurrentTime(data.pong);
    } catch (err) {
      setError("No pudimos conectar con el servidor. Intente más tarde.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Llamar al servidor al cargar la página
    fetchServerTime();
  }, []);

  // Características de seguros
  const features = [
    {
      id: 1,
      icon: "🛡️",
      title: "Cobertura Total",
      description: "Protección ante cualquier siniestro."
    },
    {
      id: 2,
      icon: "📞",
      title: "Atención 24/7",
      description: "Siempre disponibles para ayudarte."
    },
    {
      id: 3,
      icon: "🚗",
      title: "Auto de Reemplazo",
      description: "No te quedes sin movilidad."
    },
    {
      id: 4,
      icon: "👨‍💼",
      title: "Asesoría Personalizada",
      description: "Un agente especializado para ti."
    }
  ];

  // Testimonios de clientes
  const testimonials = [
    {
      id: 1,
      name: "Carlos M.",
      text: "Gracias a SegurosFlex recibí un auto de reemplazo en menos de 24 horas.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      emoji: "🚗"
    },
    {
      id: 2,
      name: "Ana R.",
      text: "Mi reclamo fue procesado sin problemas y obtuve mi indemnización muy rápido.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      emoji: "💰"
    },
    {
      id: 3,
      name: "Luis P.",
      text: "Me asistieron cuando más lo necesitaba, excelente servicio!",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      emoji: "⭐"
    }
  ];

  // Preguntas frecuentes
  const faqs = [
    {
      id: 1,
      question: "¿Qué cubre el seguro de auto?",
      answer: "Nuestro seguro de auto cubre daños por accidentes, robo, responsabilidad civil, asistencia en viaje y más. Cada plan puede personalizarse según tus necesidades específicas."
    },
    {
      id: 2,
      question: "¿Cómo hacer un reclamo?",
      answer: "Puedes hacer un reclamo llamando a nuestra línea 24/7, a través de nuestra app móvil o en nuestra página web. Un asesor te guiará en todo el proceso hasta la resolución."
    },
    {
      id: 3,
      question: "¿Cuáles son los métodos de pago?",
      answer: "Aceptamos tarjetas de crédito/débito, transferencias bancarias, pagos en efectivo en nuestras oficinas y financiamiento en cuotas sin interés."
    }
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <span className="logo-icon">🚗</span>
          <h1 className="logo-text">SegurosFlex</h1>
        </div>
        <nav className="main-nav">
          <ul>
            <li><a href="#seguros">Seguros</a></li>
            <li><a href="#promociones">Promociones</a></li>
            <li><a href="#atencion">Atención al Cliente</a></li>
            <li><a href="#nosotros">Sobre Nosotros</a></li>
          </ul>
        </nav>
        <div className="nav-actions">
          <button className="search-btn" aria-label="Buscar">🔍</button>
          <button className="phone-btn" aria-label="Llamar">📞</button>
          <button className="login-btn" onClick={handleLoginClick}>
            {isAuthenticated ? 'Mi cuenta' : 'Ingresa a tu cuenta'}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            <span className="hero-car-icon">🚗</span> Protege tu vehículo con <span className="brand-highlight">SegurosFlex</span>
          </h2>
          <p className="hero-description">
            ✅ Cobertura completa, atención rápida y las mejores tarifas.
          </p>
          <div className="hero-cta">
            <button className="primary-btn">Cotiza ahora</button>
            <button className="secondary-btn">Conoce nuestros planes</button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="seguros">
        <div className="features-container">
          {features.map(feature => (
            <div key={feature.id} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="section-header">
          <span className="chat-icon">💬</span>
          <h2 className="section-title">Lo que dicen nuestros clientes</h2>
        </div>
        <div className="testimonials-container">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="testimonial-avatar" 
              />
              <p className="testimonial-text">
                {testimonial.text} {testimonial.emoji}
              </p>
              <p className="testimonial-author">{testimonial.name} <span className="smile-icon">😊</span></p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="atencion">
        <div className="section-header">
          <span className="question-icon">❓</span>
          <h2 className="section-title">Preguntas Frecuentes</h2>
        </div>
        <p className="faq-description">
          Resolvemos tus dudas más comunes para que estés 100% seguro. 🚘
        </p>
        <div className="faq-container">
          <div className="faq-image-container">
            <img 
              src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80" 
              alt="FAQ" 
              className="faq-image" 
            />
          </div>
          <div className="faq-questions">
            {faqs.map(faq => (
              <details key={faq.id} className="faq-item">
                <summary className="faq-question">{faq.question}</summary>
                <p className="faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Server Time Section */}
      <section className="server-time">
        <div className="time-container">
          <h3>Estado del servidor:</h3>
          {loading ? (
            <p>Conectando con el servidor...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : currentTime ? (
            <p>Servidor activo. Hora actual: {new Date(currentTime).toLocaleString()}</p>
          ) : (
            <p>Información del servidor no disponible</p>
          )}
          <button 
            className="refresh-btn" 
            onClick={fetchServerTime}
            disabled={loading}
          >
            Actualizar
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 SegurosFlex - Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage; 