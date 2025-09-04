FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    postgresql-client \  
    zip unzip git curl libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

RUN chown -R www-data:www-data /var/www
