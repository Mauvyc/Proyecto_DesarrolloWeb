FROM php:8.0-apache

# Instalar dependencias y extensiones necesarias para PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Habilitar el módulo rewrite de Apache
RUN a2enmod rewrite

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar los archivos del backend
COPY backend/ /var/www/html/

# Instalar dependencias con Composer
RUN if [ -f "composer.json" ]; then composer install --no-interaction --optimize-autoloader; fi

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html

# Configurar Apache para escuchar en $PORT
RUN echo 'Listen ${PORT}' > /etc/apache2/ports.conf && \
    sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf

# Exponer puerto
EXPOSE ${PORT}

# Iniciar Apache
CMD ["apache2-foreground"] 