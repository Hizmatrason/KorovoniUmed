#!/bin/bash
set -e

DOMAIN="caravanofhope.tj"
EMAIL="info@caravanofhope.tj"

echo "=== Step 1: Starting services with HTTP-only nginx ==="
cp nginx/init.conf nginx/active.conf
docker compose -f docker-compose.yml up -d --build

echo "=== Step 2: Waiting for services to be ready ==="
sleep 10

echo "=== Step 3: Obtaining SSL certificate ==="
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email "$EMAIL" \
  --agree-tos \
  --no-eff-email \
  -d "$DOMAIN" \
  -d "www.$DOMAIN"

echo "=== Step 4: Switching to SSL nginx config ==="
cp nginx/default.conf nginx/active.conf
docker compose exec nginx nginx -s reload

echo "=== Done! Site is live at https://$DOMAIN ==="
