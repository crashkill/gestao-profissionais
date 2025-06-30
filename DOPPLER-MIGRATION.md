# 🔐 **Migração para Doppler - Talent Sphere Registry**

## ⚠️ **SITUAÇÃO ATUAL - RISCO DE SEGURANÇA**

**❌ PROBLEMAS IDENTIFICADOS:**
- Credenciais do Supabase expostas no arquivo `.env`
- Tokens em texto plano no repositório
- Sem controle de acesso por equipe
- Sem auditoria de uso das credenciais

## 🚀 **MIGRAÇÃO AUTOMÁTICA**

### 1. **Executar Script de Migração**

```bash
# Executar migração automática
npm run doppler:setup
```

O script irá:
- ✅ Verificar instalação do Doppler
- ✅ Configurar projeto `talent-sphere-registry`
- ✅ Migrar variáveis do `.env` para o Doppler
- ✅ Configurar ambiente de desenvolvimento

### 2. **Usar Doppler no Desenvolvimento**

```bash
# NOVO - Com Doppler (SEGURO)
npm run doppler:dev

# ANTIGO - Direto (INSEGURO)
npm run dev
```

### 3. **Variáveis Migradas**

| Variável | Status | Descrição |
|----------|---------|-----------|
| `VITE_SUPABASE_URL` | ✅ Migrada | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | ✅ Migrada | Chave anônima do Supabase |

## 🛡️ **BENEFÍCIOS DE SEGURANÇA**

### **Antes (INSEGURO):**
```bash
# .env (EXPOSTO)
VITE_SUPABASE_URL=https://pwksgdjjkryqryqryqrvyja.supabase.co
VITE_SUPABASE_ANON_KEY=[SUA_NOVA_CHAVE_AQUI]
```

### **Depois (SEGURO):**
```bash
# Variáveis centralizadas no Doppler
# Controle de acesso por usuário
# Auditoria de quem acessa o quê
# Rotação fácil de credenciais
```

## 📋 **COMANDOS DISPONÍVEIS**

| Comando | Descrição | Uso |
|---------|-----------|-----|
| `npm run doppler:dev` | Desenvolvimento com Doppler | Desenvolvimento local |
| `npm run doppler:build` | Build com Doppler | CI/CD |
| `npm run doppler:preview` | Preview com Doppler | Testes locais |
| `npm run doppler:setup` | Configuração inicial | Uma vez apenas |

## 🔄 **ROTAÇÃO DE CREDENCIAIS**

```bash
# Atualizar URL do Supabase
doppler secrets set VITE_SUPABASE_URL="nova-url"

# Atualizar chave anônima
doppler secrets set VITE_SUPABASE_ANON_KEY="nova-chave"

# Verificar mudanças
doppler secrets
```

## 👥 **COMPARTILHAMENTO COM EQUIPE**

```bash
# Adicionar desenvolvedor
doppler team add dev@hitss.com --role developer

# Adicionar administrador
doppler team add admin@hitss.com --role admin
```

## 🚀 **DEPLOY EM PRODUÇÃO**

### **GitHub Actions:**
```yaml
- name: Setup Doppler
  uses: dopplerhq/cli-action@v2
  
- name: Export Secrets
  run: doppler secrets download --no-file --format env >> $GITHUB_ENV
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

### **Vercel/Netlify:**
- Conectar integração Doppler no dashboard
- Variáveis sincronizadas automaticamente

## ❓ **FAQ**

**Q: Posso manter o .env?**
A: Sim, mas recomendamos remover para maior segurança.

**Q: Como testar se funcionou?**
A: Execute `npm run doppler:dev` e acesse a aplicação.

**Q: E se der erro?**
A: Verifique se está logado: `doppler login`

## 🔗 **Links Úteis**

- [Dashboard Doppler](https://dashboard.doppler.com/)
- [Documentação Doppler](https://docs.doppler.com/)
- [Integração GitHub Actions](https://docs.doppler.com/docs/github-actions)

---

**🎯 Resultado:** Sistema 100% seguro com credenciais centralizadas! 