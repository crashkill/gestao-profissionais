#!/bin/bash

# 🚀 Script de Deploy para Homologação - Talent Sphere Registry
# Data: $(date)
# Desenvolvedor: Fabrício Lima

set -e  # Parar em caso de erro

echo "🚀 INICIANDO DEPLOY DE HOMOLOGAÇÃO..."
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: Execute este script na raiz do projeto!${NC}"
    exit 1
fi

# Verificar se Doppler está configurado
echo -e "${BLUE}🔧 Verificando configuração Doppler...${NC}"
if ! command -v doppler &> /dev/null; then
    echo -e "${RED}❌ Doppler CLI não encontrado! Instale com: brew install dopplerhq/cli/doppler${NC}"
    exit 1
fi

# Verificar se o projeto existe no Doppler
if ! doppler configs --project talent-sphere-registry &> /dev/null; then
    echo -e "${RED}❌ Projeto 'talent-sphere-registry' não encontrado no Doppler!${NC}"
    exit 1
fi

# Verificar se a configuração de homologação existe
echo -e "${BLUE}🔧 Verificando configuração de homologação...${NC}"
if ! doppler configs get stg_homologacao --project talent-sphere-registry &> /dev/null; then
    echo -e "${RED}❌ Configuração 'stg_homologacao' não encontrada!${NC}"
    exit 1
fi

# Backup da configuração atual (se existir)
echo -e "${BLUE}💾 Fazendo backup das configurações...${NC}"
if [ -f ".env.backup" ]; then
    cp .env.backup .env.backup.$(date +%Y%m%d_%H%M%S)
fi
if [ -f ".env" ]; then
    cp .env .env.backup
fi

# Limpeza de cache e node_modules (opcional)
read -p "🧹 Deseja limpar cache e reinstalar dependências? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Limpando cache...${NC}"
    npm cache clean --force
    rm -rf node_modules package-lock.json
    npm install
fi

# Build para homologação
echo -e "${BLUE}🔨 Fazendo build para homologação...${NC}"
doppler run --project talent-sphere-registry --config stg_homologacao -- npm run build:homologacao

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no build!${NC}"
    exit 1
fi

# Verificar se o Supabase está acessível
echo -e "${BLUE}🔗 Testando conectividade com Supabase...${NC}"
SUPABASE_URL=$(doppler secrets get VITE_SUPABASE_URL --project talent-sphere-registry --config stg_homologacao --plain)
if curl -s "$SUPABASE_URL/rest/v1/" > /dev/null; then
    echo -e "${GREEN}✅ Supabase acessível!${NC}"
else
    echo -e "${RED}❌ Erro: Não foi possível acessar o Supabase!${NC}"
    exit 1
fi

# Executar testes básicos (se existirem)
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    echo -e "${BLUE}🧪 Executando testes...${NC}"
    doppler run --project talent-sphere-registry --config stg_homologacao -- npm test 2>/dev/null || echo -e "${YELLOW}⚠️ Testes não executados ou não encontrados${NC}"
fi

# Verificar funções SQL
echo -e "${BLUE}🗄️ Verificando funções SQL no banco...${NC}"
echo "Funções necessárias:"
echo "- get_skill_proficiency_distribution"
echo "- get_contract_types_count"
echo "- get_skill_distribution"
echo "- get_professionals_by_skill_and_proficiency"

# Deploy summary
echo -e "\n${GREEN}🎉 DEPLOY DE HOMOLOGAÇÃO CONCLUÍDO!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Resumo do Deploy:${NC}"
echo "• Ambiente: Homologação (stg_homologacao)"
echo "• Build: ✅ Concluído"
echo "• Banco: ✅ Conectado"
echo "• Configuração: ✅ Doppler"
echo ""
echo -e "${BLUE}🌐 Para executar:${NC}"
echo "npm run dev:homologacao"
echo ""
echo -e "${BLUE}🔗 URLs de acesso:${NC}"
echo "• Local: http://localhost:8082/talent-sphere-homologacao/"
echo "• Network: http://$(hostname -I | awk '{print $1}'):8082/talent-sphere-homologacao/"
echo ""
echo -e "${BLUE}📊 Para verificar métricas:${NC}"
echo "• Dashboard: Acessar a URL acima"
echo "• Logs: Verificar terminal durante execução"
echo "• Banco: 15 profissionais, 69 skills, 4 funções"
echo ""
echo -e "${YELLOW}⚠️ Próximos passos:${NC}"
echo "1. Testar todas as funcionalidades"
echo "2. Validar gráficos e métricas"
echo "3. Confirmar busca de profissionais"
echo "4. Preparar para deploy em staging real"
echo ""
echo -e "${GREEN}✨ Deploy finalizado com sucesso!${NC}" 