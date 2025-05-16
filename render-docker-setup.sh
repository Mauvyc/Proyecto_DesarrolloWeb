#!/bin/bash

# Este script ayuda a configurar el servicio Docker en Render

# Construir la imagen
docker build -t segurosflex-php-backend .

# Si PORT no está definido, usar 8080
export PORT=${PORT:-8080}

# Ejecutar el contenedor
docker run -p $PORT:$PORT -e PORT=$PORT \
  -e DB_HOST="$DB_HOST" \
  -e DB_USER="$DB_USER" \
  -e DB_PASSWORD="$DB_PASSWORD" \
  -e DB_DATABASE="$DB_DATABASE" \
  -e DB_PORT="$DB_PORT" \
  -e DB_SCHEMA="$DB_SCHEMA" \
  -e DB_SSL="$DB_SSL" \
  -e JWT_SECRET="$JWT_SECRET" \
  -e JWT_EXPIRES_IN="$JWT_EXPIRES_IN" \
  -e FRONTEND_URL="$FRONTEND_URL" \
  -e ALLOWED_ORIGINS="$ALLOWED_ORIGINS" \
  --name segurosflex-container segurosflex-php-backend 