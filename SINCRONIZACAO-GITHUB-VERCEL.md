# 🔄 Sincronização GitHub ↔ Vercel

## 🎯 Objetivo
Sincronizar as configurações entre GitHub e Vercel para que ambos os ambientes funcionem corretamente com o mesmo código-fonte.

---

## ✅ Alterações Realizadas

### 1. **Arquivo `vercel.json` Criado**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm ci"
}
```

**Benefícios**:
- ✅ Roteamento SPA correto
- 🛡️ Headers de segurança
- ⚡ Configuração otimizada para Vite

### 2. **`vite.config.ts` Atualizado**
```typescript
production: {
  // Vercel precisa de base '/' para funcionar corretamente
  // GitHub Pages usa '/gestao-profissionais/'
  base: process.env.VERCEL ? '/' : '/gestao-profissionais/',
  proxyTarget: env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
}
```

**Benefícios**:
- 🎯 Detecção automática do ambiente
- 📁 Base path correto para cada plataforma
- 🔄 Mesmo código para ambos os ambientes

### 3. **Script `build:vercel` Adicionado**
```json
"build:vercel": "VERCEL=true tsc -b && VERCEL=true vite build --mode production"
```

**Benefícios**:
- 🏗️ Build específico para Vercel
- 🔧 Variável de ambiente VERCEL=true
- ⚙️ Configuração otimizada

---

## 🚀 Próximos Passos para Reconfigurar a Vercel

### Etapa 1: Acessar o Dashboard da Vercel
1. Acesse: https://vercel.com/dashboard
2. Faça login com sua conta GitHub
3. Procure pelo projeto `gestao-profissionais` ou `trae-gestao-profissionais`

### Etapa 2: Verificar Projeto Existente

**Se o projeto existir:**
1. Clique no projeto
2. Vá em **Settings** → **Git**
3. Verifique se está conectado ao repositório correto: `crashkill/gestao-profissionais`
4. Se não estiver, reconecte o repositório

**Se o projeto não existir:**
1. Clique em **"Add New..."** → **"Project"**
2. Selecione **"Import Git Repository"**
3. Procure por `crashkill/gestao-profissionais`
4. Clique em **"Import"**

### Etapa 3: Configurar Build Settings

1. **Framework Preset**: `Vite`
2. **Build Command**: `npm run build:vercel`
3. **Output Directory**: `dist`
4. **Install Command**: `npm ci`
5. **Node.js Version**: `18.x` ou `20.x`

### Etapa 4: Configurar Environment Variables

**Variáveis obrigatórias:**
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_ENVIRONMENT=production
VERCEL=true
```

**Como adicionar:**
1. Vá em **Settings** → **Environment Variables**
2. Adicione cada variável
3. Selecione **Production**, **Preview** e **Development**
4. Clique **"Save"**

### Etapa 5: Fazer Deploy

1. **Deploy automático**: O push já foi feito, aguarde o deploy
2. **Deploy manual**: Clique em **"Deployments"** → **"Redeploy"**
3. **Aguarde**: 2-5 minutos para conclusão

---

## 🔍 Verificação Final

### Teste 1: Verificar Build
1. Acesse **Deployments** no dashboard
2. Verifique se o último deploy está **"Ready"**
3. Não deve haver erros no log

### Teste 2: Acessar o Site
1. Clique na URL do projeto ou acesse:
   ```
   https://gestao-profissionais.vercel.app/
   ```
2. **Resultado esperado**:
   - ✅ Site carrega corretamente
   - ✅ Dashboard exibe dados
   - ✅ Navegação funciona
   - ✅ Sem erros no console

### Teste 3: Verificar Funcionalidades
- [ ] Dashboard carrega
- [ ] Gráficos aparecem
- [ ] Botões funcionam
- [ ] Importação Excel funciona
- [ ] Chat AI responde

---

## 🆚 Comparação: GitHub Pages vs Vercel

| Aspecto | GitHub Pages | Vercel |
|---------|--------------|--------|
| **Base Path** | `/gestao-profissionais/` | `/` |
| **Build Command** | `npm run build:production` | `npm run build:vercel` |
| **Deploy Trigger** | Push para `main` | Push para `main` |
| **Environment Variables** | GitHub Secrets | Vercel Dashboard |
| **URL** | `crashkill.github.io/gestao-profissionais/` | `gestao-profissionais.vercel.app/` |
| **Status** | ✅ Funcionando | ⚠️ Precisa reconfigurar |

---

## 🛠️ Troubleshooting

### Problema: Build falha na Vercel
**Solução:**
1. Verificar se as variáveis de ambiente estão configuradas
2. Usar build command: `npm run build:vercel`
3. Verificar logs de erro no dashboard

### Problema: Site carrega mas com erro 404 nas rotas
**Solução:**
1. Verificar se `vercel.json` está no repositório
2. Fazer redeploy após adicionar o arquivo

### Problema: Variáveis de ambiente não carregam
**Solução:**
1. Verificar se `VERCEL=true` está configurado
2. Verificar se as variáveis estão em **Production**
3. Fazer redeploy após configurar

---

## 📋 Checklist Final

- [ ] Código sincronizado no GitHub
- [ ] `vercel.json` criado
- [ ] `vite.config.ts` atualizado
- [ ] Script `build:vercel` adicionado
- [ ] Projeto reconfigurado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site funcionando corretamente
- [ ] Ambos os ambientes (GitHub Pages + Vercel) funcionais

---

**🎯 Resultado Esperado**: Ambos os ambientes funcionando com o mesmo código-fonte, cada um com suas configurações específicas otimizadas.

**📅 Data**: 01/08/2025  
**👨‍💻 Desenvolvedor**: Fabricio Lima  
**🏢 Empresa**: GlobalHitss