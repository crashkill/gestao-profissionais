#!/bin/bash

# 🦊 Script de Setup GitLab - Gestão Profissional HITSS
# Este script automatiza a configuração do projeto no GitLab

set -e

echo "🦊 Iniciando setup do GitLab para Gestão Profissional HITSS..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git não está instalado!"
    exit 1
fi

print_status "Git encontrado"

# Verificar se estamos em um repositório git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Este não é um repositório Git!"
    exit 1
fi

print_status "Repositório Git válido"

# Solicitar URL do GitLab
echo ""
print_info "Configure a URL do GitLab da GlobalHitss:"
echo "Exemplo: https://gitlab.globalhitss.com/ti/gestao-profissional.git"
read -p "URL do GitLab: " GITLAB_URL

if [ -z "$GITLAB_URL" ]; then
    print_error "URL do GitLab é obrigatória!"
    exit 1
fi

# Verificar se o remote gitlab já existe
if git remote | grep -q "^gitlab$"; then
    print_warning "Remote 'gitlab' já existe. Removendo..."
    git remote remove gitlab
fi

# Adicionar remote do GitLab
print_info "Adicionando remote do GitLab..."
git remote add gitlab "$GITLAB_URL"
print_status "Remote GitLab adicionado"

# Verificar se há mudanças não commitadas
if ! git diff-index --quiet HEAD --; then
    print_warning "Há mudanças não commitadas. Fazendo commit..."
    git add .
    git commit -m "🦊 Setup GitLab: Adicionar configuração CI/CD

- .gitlab-ci.yml: Pipeline completo com build, test e deploy
- gitlab-setup.sh: Script de configuração automatizada
- GITLAB-SETUP.md: Documentação do GitLab

Configurado para GlobalHitss com:
✅ Build automatizado
✅ Deploy staging/produção
✅ Cache otimizado
✅ Relatórios de dependências"
fi

# Push para GitLab
print_info "Fazendo push para o GitLab..."
if git push gitlab main; then
    print_status "Push realizado com sucesso!"
else
    print_error "Falha no push. Verifique:"
    echo "  1. URL do GitLab está correta"
    echo "  2. Você tem permissões de escrita"
    echo "  3. O projeto existe no GitLab"
    echo ""
    echo "Para criar o projeto manualmente:"
    echo "  1. Acesse: https://gitlab.globalhitss.com"
    echo "  2. Clique em 'New Project'"
    echo "  3. Nome: 'Gestão Profissional'"
    echo "  4. Visibilidade: Private"
    echo "  5. Copie a URL e execute este script novamente"
    exit 1
fi

# Exibir informações finais
echo ""
print_status "🎉 Setup do GitLab concluído com sucesso!"
echo ""
print_info "Próximos passos:"
echo "  1. Acesse o projeto no GitLab: ${GITLAB_URL%%.git}"
echo "  2. Configure as variáveis de ambiente em Settings > CI/CD > Variables:"
echo "     - VITE_SUPABASE_URL"
echo "     - VITE_SUPABASE_ANON_KEY"
echo "     - DOPPLER_TOKEN (opcional)"
echo ""
echo "  3. A pipeline será executada automaticamente nos próximos commits"
echo "  4. Deploy manual disponível para staging e produção"
echo ""
print_status "Documentação completa em: GITLAB-SETUP.md"

# Exibir remotes configurados
echo ""
print_info "Remotes configurados:"
git remote -v

echo ""
print_status "✨ Projeto pronto para desenvolvimento colaborativo!" 