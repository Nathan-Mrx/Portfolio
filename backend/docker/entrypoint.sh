#!/bin/sh
set -e

cd /app

echo "Installing dependencies..."
composer install --no-interaction --optimize-autoloader --no-scripts

echo "Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction

echo "Generating JWT keypair (if not present)..."
php bin/console lexik:jwt:generate-keypair --skip-if-exists

echo "Creating admin user (if not exists)..."
php bin/console app:create-user \
    "${ADMIN_EMAIL:-admin@example.com}" \
    "${ADMIN_PASSWORD:-ChangeMe123!}" \
    yes \
    --if-not-exists

echo "Starting PHP server..."
exec php -S 0.0.0.0:8000 -t public
