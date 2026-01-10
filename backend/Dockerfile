FROM php:8.4-cli

RUN apt-get update && apt-get install -y libpq-dev libicu-dev zip unzip \
    && docker-php-ext-install pdo pdo_pgsql opcache intl

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY docker/php/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /app
