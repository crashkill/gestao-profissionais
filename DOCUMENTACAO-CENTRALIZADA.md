# 📋 DOCUMENTAÇÃO CENTRALIZADA - GESTÃO PROFISSIONAL

## 🎯 Visão Geral do Projeto

**Nome:** Talent Sphere Registry - Sistema de Gestão de Profissionais HITSS  
**Versão:** 1.0.0  
**Desenvolvedor:** Fabrício Cardoso de Lima  
**Status:** 🔄 **QUASE FINALIZADO - NECESSITA CORREÇÕES**

## 📊 Status Atual

### ✅ Funcionando
- 115 profissionais carregados do Supabase
- Interface responsiva e moderna
- Dashboard com gráficos interativos
- Conectividade robusta com fallback automático
- Segurança implementada com Doppler
- Deploy em GitHub Pages funcionando

### ❌ Problemas Identificados

1. **Build de Produção Falhando**
   - Variáveis de ambiente não carregadas no build
   - Configuração do Vite não compatível com GitHub Actions

2. **Segurança**
   - Arquivo .env sendo detectado no Git
   - Vulnerabilidades em dependências (esbuild, xlsx)

3. **Ambientes**
   - Configuração de ambientes não totalmente funcional
   - Secrets do GitHub Actions não configurados

## 🏗️ Arquitetura Técnica

### Frontend
- **React 18** + TypeScript
- **Vite 5** (build e desenvolvimento)
- **Tailwind CSS** + **Radix UI** (shadcn/ui)
- **Recharts** para gráficos
- **Framer Motion** para animações

### Backend
- **Supabase** (PostgreSQL)
- **Projeto Produção:** `pwksgdjjkryqryqrvyja`
- **Projeto Homologação:** `zbiivgtdamejiwcabmcv`
- **115 profissionais** cadastrados

### DevOps
- **GitHub Actions** para CI/CD
- **GitHub Pages** para hospedagem
- **Doppler** para gestão de segredos
- **3 ambientes:** desenvolvimento, homologação, produção

## 🗂️ Estrutura de Arquivos

```
Gestao-Profissional/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes de interface
│   │   ├── Dashboard.tsx   # Dashboard principal
│   │   ├── ExcelImport.tsx # Importação de dados
│   │   └── ManualForm.tsx  # Formulário manual
│   ├── lib/                # Bibliotecas e utils
│   │   ├── supabaseClient.ts # Cliente Supabase
│   │   └── utils.ts        # Utilitários
│   ├── pages/              # Páginas da aplicação
│   └── types/              # Tipos TypeScript
├── .github/workflows/      # GitHub Actions
├── config/                 # Configurações de ambiente
├── supabase/              # Configuração Supabase
└── scripts/               # Scripts de deploy
```

## 🔧 Configuração de Ambientes

### Desenvolvimento
- **URL:** http://localhost:5173
- **Banco:** Homologação (zbiivgtdamejiwcabmcv)
- **Comando:** `npm run dev`

### Homologação
- **URL:** https://crashkill.github.io/Gestao-Profissional-Homolog/
- **Banco:** Homologação (zbiivgtdamejiwcabmcv)
- **Branch:** homolog (não existe ainda)

### Produção
- **URL:** https://crashkill.github.io/Gestao-Profissional/
- **Banco:** Produção (pwksgdjjkryqryqrvyja)
- **Branch:** main

## 🚀 Funcionalidades Implementadas

### Dashboard Principal
- Métricas em tempo real (Total, CLT, PJ)
- Gráficos interativos de skills e proficiências
- Lista de profissionais filtráveis
- Exportação para Excel

### Gestão de Dados
- Import Excel para cadastro em lote
- Formulário manual para cadastros individuais
- Validação completa de dados
- Integração com Supabase

### Segurança
- Gestão de segredos via Doppler
- Validação de tokens
- Fallback automático para conectividade
- Monitoramento de segurança

## 📊 Banco de Dados

### Tabela: colaboradores
```sql
- id (uuid, primary key)
- nome_completo (text)
- email (text)
- regime (text) -- CLT/PJ
- skill_principal (text)
- nivel_experiencia (text)
- proficiencia_cargo (text)
- disponivel_compartilhamento (boolean)
- percentual_compartilhamento (text)
- [38 campos adicionais de skills]
```

### Funções SQL Criadas
- `get_skill_proficiency_distribution()` - Distribuição de proficiências
- `get_contract_types_count()` - Contagem por tipo de contrato
- `get_professionals_by_skill_and_proficiency()` - Busca de profissionais

## 🔄 Workflow de Deploy

### GitHub Actions
1. **Security Check** - Validação de segurança
2. **Build** - Compilação da aplicação
3. **Deploy** - Publicação no GitHub Pages
4. **Verification** - Verificação pós-deploy

### Branches
- `main` - Produção
- `homolog` - Homologação (a ser criada)
- `develop` - Desenvolvimento (opcional)

## 🛡️ Segurança

### Variáveis de Ambiente
- `VITE_SUPABASE_URL` - URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY` - Chave anônima do Supabase
- `VITE_ENVIRONMENT` - Ambiente atual

### Doppler
- Projeto: `gestao-profissional-hitss`
- Ambientes: `development`, `homologacao`, `production`

## 🔍 Problemas Identificados e Soluções

### 1. Build de Produção Falhando
**Problema:** Variáveis de ambiente não carregadas no build
**Solução:** 
- Configurar secrets no GitHub Actions
- Ajustar vite.config.ts para funcionar sem variáveis locais

### 2. Arquivo .env no Git
**Problema:** Arquivo sensível sendo detectado
**Solução:** 
- Remover .env do Git
- Adicionar ao .gitignore

### 3. Vulnerabilidades de Dependências
**Problema:** esbuild e xlsx com vulnerabilidades
**Solução:**
- Atualizar dependências
- Usar alternativas seguras se necessário

### 4. Configuração de Ambientes
**Problema:** Ambientes não totalmente funcionais
**Solução:**
- Criar branch homolog
- Configurar secrets para cada ambiente

## 📋 Lista de Correções Necessárias

### Prioridade Alta
1. ✅ Configurar secrets do GitHub Actions
2. ✅ Corrigir build de produção
3. ✅ Remover arquivo .env do Git
4. ✅ Atualizar dependências vulneráveis

### Prioridade Média
5. ✅ Criar branch homolog
6. ✅ Configurar ambiente de homologação
7. ✅ Testar deploy em produção
8. ✅ Criar documentação de uso

### Prioridade Baixa
9. ✅ Adicionar MCP do GitHub Actions
10. ✅ Otimizar performance
11. ✅ Implementar testes automatizados
12. ✅ Adicionar monitoramento

## 🎯 Próximos Passos

1. **Correção dos Problemas Identificados**
2. **Configuração Completa dos Ambientes**
3. **Testes Finais em Produção**
4. **Documentação de Uso para Equipe**
5. **Treinamento dos Usuários**

## 🔧 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Doppler CLI instalado

### Instalação
```bash
# Clonar repositório
git clone https://github.com/crashkill/Gestao-Profissional.git
cd Gestao-Profissional

# Instalar dependências
npm install

# Configurar Doppler
npm run doppler:setup

# Executar desenvolvimento
npm run dev
```

### Deploy
```bash
# Build para produção
npm run build

# Deploy automático via GitHub Actions
git push origin main
```

## 📞 Contato e Suporte

- **Desenvolvedor:** Fabrício Cardoso de Lima
- **Email:** [contato]
- **Repositório:** https://github.com/crashkill/Gestao-Profissional
- **Aplicação:** https://crashkill.github.io/Gestao-Profissional/

---

**Última atualização:** Janeiro 2025 