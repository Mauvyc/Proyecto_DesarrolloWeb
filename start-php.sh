#!/bin/bash

# Instalar PHP si no está instalado
if ! command -v php &> /dev/null; then
    echo "PHP no encontrado, intentando instalar..."
    apt-get update && apt-get install -y php php-pgsql php-mbstring php-xml
fi

# Instalar Composer si no está instalado
if ! command -v composer &> /dev/null; then
    echo "Composer no encontrado, instalando..."
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer
    php -r "unlink('composer-setup.php');"
fi

# Entrar al directorio del backend e instalar dependencias
cd backend
if [ -f "composer.json" ]; then
    composer install
fi

# Iniciar el servidor PHP
php -S 0.0.0.0:${PORT:-3000} -t . 