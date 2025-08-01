# 🚀 Guia Completo: Configuração Manual do Vercel

## 🎯 Objetivo
Reconfigurar o deploy no Vercel para o projeto `gestao-profissionais` e corrigir o erro 404 na URL.

---

## 📋 Situação Atual
- ❌ **URL atual com erro**: https://trae-gestao-profissionais-yfd3.vercel.app/ (404)
- ✅ **Repositório**: crashkill/gestao-profissionais
- ✅ **Arquivos prontos**: Build configurado e funcional

---

## 🚀 Passo a Passo Detalhado

### Etapa 1: Acessar o Vercel

1. **Abra seu navegador**

2. **Acesse o Vercel**:
   ```
   https://vercel.com
   ```

3. **Faça login**:
   - Clique em "Login"
   - Use sua conta GitHub (recomendado)
   - Ou use email/senha se já tem conta

### Etapa 2: Verificar Projetos Existentes

1. **No Dashboard do Vercel**, procure por:
   - `gestao-profissionais`
   - `trae-gestao-profissionais`
   - Qualquer projeto relacionado

2. **Se encontrar o projeto**:
   - Clique no projeto
   - Vá para "Settings" → "Domains"
   - Verifique se a URL está correta

3. **Se NÃO encontrar o projeto**:
   - Continue para Etapa 3 (Novo Deploy)

### Etapa 3: Novo Deploy (Recomendado)

#### 3.1 Importar Repositório

1. **No Dashboard**, clique em "Add New...":
   ```
   [Add New...] ▼
   ├── Project ← Selecione esta opção
   ├── Team
   └── Domain
   ```

2. **Na tela "Import Git Repository"**:
   - Procure por `crashkill/gestao-profissionais`
   - **Se não aparecer**: Clique em "Adjust GitHub App Permissions"
   - **Autorize o acesso** ao repositório

3. **Clique em "Import"** no repositório correto

#### 3.2 Configurar Deploy

1. **Configure o projeto**:
   ```
   Project Name: gestao-profissionais
   Framework Preset: Vite
   Root Directory: ./ (padrão)
   ```

2. **Build and Output Settings**:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables** (CRÍTICO):
   ```
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   VITE_ENVIRONMENT=production
   ```
   
   **⚠️ IMPORTANTE**: Use as mesmas variáveis do Doppler

#### 3.3 Deploy

1. **Clique em "Deploy"**
2. **Aguarde o build** (2-5 minutos)
3. **Verifique se não há erros** no log

### Etapa 4: Configurar Domínio Personalizado (Opcional)

1. **Após deploy bem-sucedido**:
   - Vá em "Settings" → "Domains"
   - A URL padrão será: `gestao-profissionais-xxx.vercel.app`

2. **Para personalizar**:
   - Clique em "Edit" na URL
   - Altere para: `gestao-profissionais`
   - Nova URL: `gestao-profissionais.vercel.app`

---

## 🔧 Configurações Avançadas

### Configurar Variáveis de Ambiente

1. **Vá em Settings → Environment Variables**

2. **Adicione as variáveis**:
   ```
   Name: VITE_SUPABASE_URL
   Value: https://seu-projeto.supabase.co
   Environments: Production, Preview, Development
   ```
   
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: sua_chave_anonima_aqui
   Environments: Production, Preview, Development
   ```
   
   ```
   Name: VITE_ENVIRONMENT
   Value: production
   Environments: Production
   ```

3. **Clique "Save"** para cada variável

### Configurar Build Settings

1. **Vá em Settings → General**

2. **Build & Development Settings**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   Node.js Version: 18.x (ou 20.x)
   ```

3. **Root Directory**: `./` (padrão)

### Configurar Redirects (Para SPA)

1. **Crie arquivo `vercel.json` na raiz** (se não existir):
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
           }
         ]
       }
     ]
   }
   ```

2. **Commit e push** para disparar novo deploy

---

## ✅ Verificação Final

### Teste 1: Verificar Deploy

1. **No Dashboard Vercel**:
   - Status deve estar: ✅ **Ready**
   - Build time: ~2-5 minutos
   - Sem erros no log

### Teste 2: Acessar o Site

1. **Clique na URL** ou acesse:
   ```
   https://gestao-profissionais.vercel.app/
   ```

2. **Resultado esperado**:
   - ✅ Site carrega normalmente
   - ✅ Dashboard da aplicação aparece
   - ✅ Sem erro 404 ou 500

### Teste 3: Verificar Funcionalidades

1. **Teste autenticação** (se configurada)
2. **Teste navegação** entre páginas
3. **Verifique console** (F12) para erros
4. **Teste responsividade**

---

## 🔧 Solução de Problemas

### Problema 1: Build falha
**Possíveis causas**:
- Variáveis de ambiente faltando
- Dependências desatualizadas
- Erro no código

**Solução**:
1. **Verifique o log de build** no Vercel
2. **Confirme variáveis de ambiente**
3. **Teste build local**: `npm run build`
4. **Atualize dependências**: `npm update`

### Problema 2: Site carrega mas com erros
**Possíveis causas**:
- Variáveis de ambiente incorretas
- Problemas de CORS
- APIs indisponíveis

**Solução**:
1. **Abra console do navegador** (F12)
2. **Verifique erros de rede**
3. **Confirme URLs das APIs**
4. **Teste em modo incógnito**

### Problema 3: Erro 404 em rotas
**Causa**: SPA routing não configurado
**Solução**:
1. **Adicione arquivo `vercel.json`** (ver seção acima)
2. **Configure rewrites** para SPA
3. **Redeploy** o projeto

### Problema 4: Variáveis de ambiente não funcionam
**Causa**: Prefixo `VITE_` faltando
**Solução**:
1. **Todas as variáveis** devem começar com `VITE_`
2. **Exemplo correto**: `VITE_SUPABASE_URL`
3. **Exemplo incorreto**: `SUPABASE_URL`
4. **Redeploy** após correção

---

## 📱 Capturas de Tela de Referência

### Tela 1: Dashboard Vercel
```
[Add New...] ← Clique para novo projeto

Your Projects:
├── projeto-1
├── projeto-2
└── [+ Import Git Repository]
```

### Tela 2: Import Repository
```
Import Git Repository

🔍 Search: crashkill/gestao-profissionais

📁 crashkill/gestao-profissionais [Import] ← Clique aqui
```

### Tela 3: Configure Project
```
Project Name: gestao-profissionais
Framework Preset: Vite
Root Directory: ./

Build and Output Settings:
Build Command: npm run build
Output Directory: dist

[Deploy] ← Clique para deploy
```

### Tela 4: Deploy Success
```
✅ Deployment completed
🌐 https://gestao-profissionais.vercel.app/
📊 Build time: 2m 34s
```

---

## 🎯 Resultado Final Esperado

### URLs Funcionais
- **Produção**: https://gestao-profissionais.vercel.app/
- **Preview**: URLs automáticas para cada PR
- **Status**: ✅ Ativo e acessível

### Configuração Completa
- ✅ Vercel conectado ao GitHub
- ✅ Auto-deploy em push para main
- ✅ Variáveis de ambiente configuradas
- ✅ Build otimizado para produção
- ✅ SPA routing funcionando
- ✅ Headers de segurança aplicados

---

## 🔄 Manutenção Contínua

### Auto-Deploy
- ✅ **Push para `main`**: Deploy automático
- ✅ **Pull Requests**: Preview automático
- ✅ **Rollback**: Fácil reversão de versões

### Monitoramento
- 📊 **Analytics**: Tráfego e performance
- 🚨 **Alerts**: Notificações de falhas
- 📈 **Insights**: Métricas de build

---

## 📞 Suporte

**Documentação Oficial**:
- [Vercel Documentation](https://vercel.com/docs)
- [Vite on Vercel](https://vercel.com/guides/deploying-vite-to-vercel)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

**Comunidade**:
- [Vercel Discord](https://vercel.com/discord)
- [GitHub Discussions](https://github.com/vercel/vercel/discussions)

---

**🚀 Seu projeto estará online e otimizado!**