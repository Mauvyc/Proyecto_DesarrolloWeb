# Backend PHP para SegurosFlex

Este es el backend para la aplicación SegurosFlex, implementado en PHP.

## Requisitos

- PHP 8.0 o superior
- PostgreSQL
- Extensión pgsql para PHP
- Extensión json para PHP

## Configuración

1. Copiar `.env.example` a `.env` y configurar las variables de entorno.
2. Asegúrate de que la base de datos PostgreSQL esté configurada correctamente.
3. Ejecuta el servidor PHP o configúralo en tu servidor web preferido.

## Estructura del proyecto

- `config/`: Archivos de configuración
- `controllers/`: Controladores de la aplicación
- `models/`: Modelos de la aplicación
- `utils/`: Utilidades y herramientas
- `views/`: Formateadores de respuesta
- `routes/`: Definiciones de rutas
- `public/`: Archivos públicos y estáticos
- `index.php`: Punto de entrada de la aplicación 