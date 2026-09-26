#!/bin/sh
set -e

echo "→ Aplicando migrations..."
node dist/config/run-migrations.js

echo "→ Rodando seed (idempotente)..."
node dist/seed/seed.js

echo "→ Iniciando a API..."
exec node dist/main
