#!/bin/bash

# ROCKET PROPOSAL GENERATOR - DEPLOY SCRIPT (V11)
# -----------------------------------------------

echo "🚀 Iniciando deploy da ROCKET..."

# 1. Instalar dependências se necessário
echo "📦 Instalando dependências..."
npm install

# 2. Build da aplicação
echo "🏗️ Construindo aplicação (Next.js Build)..."
npm run build

# 3. Criar diretório de logs se não existir
mkdir -p logs

# 4. Gerenciar processo com PM2
echo "🔄 Reiniciando processo PM2..."
if command -v pm2 &> /dev/null
then
    pm2 delete rocket-generator 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
else
    echo "⚠️ PM2 não encontrado. Pulando reinicialização de processo."
fi

echo "✅ Deploy concluído com sucesso!"
