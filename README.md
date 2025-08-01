# 🎯 Talent Sphere Registry - HITSS

Sistema de gestão de profissionais de TI para HITSS (GlobalHitss) com interface moderna e conectividade robusta com Supabase.

## ✅ Status do Projeto

**🟢 FUNCIONANDO COMPLETAMENTE**
- ✅ 115 profissionais carregados do Supabase
- ✅ Métricas reais: CLT: 50, PJ: 65  
- ✅ Proxy configurado para resolver problemas de DNS
- ✅ Doppler integrado para segurança
- ✅ Interface responsiva e moderna

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Doppler CLI instalado

### Instalação Rápida

```bash
# 1. Clonar repositório
git clone <repo-url>
cd talent-sphere-registry

# 2. Instalar dependências
npm install

# 3. Configurar MCP (opcional - para integrações avançadas)
npm run mcp:setup

# 4. Configurar Doppler (se necessário)
npm run doppler:setup

# 5. Executar em desenvolvimento
npm run doppler:dev
```

**Aplicação estará disponível em:** http://localhost:8080

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento com Doppler
npm run doppler:dev

# Build para produção
npm run doppler:build

# Preview da build
npm run doppler:preview

# Configurar Doppler
npm run doppler:setup

# Configurar MCP (integrações avançadas)
npm run mcp:setup

# Desenvolvimento tradicional (sem Doppler)
npm run dev
```

## 🏗️ Arquitetura

### Frontend
- **React 18** + TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** + **Radix UI** (shadcn/ui)
- **Recharts** para gráficos

### Backend
- **Supabase** (PostgreSQL)
- **115 profissionais** cadastrados
- **Tabela colaboradores** com 43 campos

### Segurança
- **Doppler** para gestão de segredos
- **Proxy Vite** para contornar problemas de DNS
- **Fallback automático** para dados mock

## 🌐 Funcionalidades

### Dashboard Principal
- **Métricas em tempo real** (Total, CLT, PJ)
- **Gráficos interativos** de skills e proficiências
- **Lista de profissionais** filtráveis

### Gestão de Dados
- **Import Excel** para cadastro em lote
- **Formulário manual** para cadastros individuais
- **Chat IA** para assistência (em desenvolvimento)

### Conectividade Robusta
- **Conexão direta** com Supabase
- **Proxy local** como fallback
- **Dados mock** como última opção

## 📊 Estrutura do Banco

### Tabela: colaboradores
```sql
- nome_completo
- email  
- regime (CLT/PJ)
- proficiencia_cargo
- skill_principal
- nivel_experiencia
- disponivel_compartilhamento
- percentual_compartilhamento
- ... (43 campos totais)
```

## 🔍 Troubleshooting

### Problema: Erro de DNS
**Solução:** O proxy automático resolve automaticamente

### Problema: Variáveis não carregadas
```bash
doppler configure
doppler run -- npm run dev
```

### Problema: Porta ocupada
**Solução:** Vite usa automaticamente a próxima porta disponível

## 📚 Documentação Completa

Para documentação detalhada, consulte:
- **[SOLUTION-DOCUMENTATION.md](./SOLUTION-DOCUMENTATION.md)** - Guia completo
- **[DOPPLER-MIGRATION.md](./DOPPLER-MIGRATION.md)** - Configuração Doppler
- **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** - Configuração Supabase
- **[MCP-SETUP.md](./MCP-SETUP.md)** - Configuração MCP

## 🛠️ Tecnologias

- React 18 + TypeScript
- Vite 5
- Tailwind CSS
- Radix UI (shadcn/ui)
- Supabase
- Doppler
- Recharts
- Faker.js (para dados mock)

## 📞 Suporte

Para problemas ou dúvidas:
1. Verificar logs do console
2. Consultar documentação completa
3. Testar conectividade via curl
4. Verificar configuração do Doppler

---

**Desenvolvido para HITSS - GlobalHitss** 🚀

## Integração com MCPs (Model Context Protocol)

### 1. Aprovação Manual no Deploy de Produção
- O workflow de produção exige aprovação manual via environment reviewers no GitHub.
- Para configurar, acesse Settings > Environments > production e adicione seu usuário como reviewer.

### 2. Diff de Estrutura dos Bancos (MCP-Supabase)
- Para comparar a estrutura dos bancos de produção e homologação:
```bash
npx @supabase/mcp-server-supabase@latest compare --source pwksgdjjkryqryqrvyja --target zbiivgtdamejiwcabmcv
```
- O resultado será um relatório das diferenças de estrutura.

### 3. Integração Doppler + GitHub Actions
- Exporte os segredos do Doppler antes do build/deploy:
```yaml
- name: Install Doppler CLI
  run: curl -sLf --retry 3 --retry-delay 2 https://downloads.doppler.com/cli/install.sh | sh
- name: Export Doppler secrets
  run: doppler secrets download --no-file --format=env >> $GITHUB_ENV
```
- Isso garante que todas as variáveis sensíveis estejam disponíveis no ambiente do Actions.

### 4. Referências MCPs disponíveis
- MCP-Supabase: gerenciamento e comparação de bancos Supabase
- MCP GitHub: automação de workflows, environments e reviewers
- Doppler: gestão centralizada de segredos
- Outros MCPs: Browserbase, Playwright, Puppeteer, Gitlab, Azure, Huggingface, Replicate, Magic

---
