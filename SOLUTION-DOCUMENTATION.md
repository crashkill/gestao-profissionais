# 📋 Documentação Completa - Talent Sphere Registry

## 🎯 **Resumo da Solução**

Sistema de gestão de profissionais de TI para HITSS (Grupo Telefônica) com resolução completa de problemas de conectividade Supabase através de proxy local e fallback inteligente.

---

## 🔧 **Configuração do Doppler (Gestão de Segredos)**

### **1. Instalação do Doppler CLI**

```bash
# macOS (via Homebrew)
brew install dopplerhq/cli/doppler

# Verificar instalação
doppler --version
```

### **2. Configuração Inicial**

```bash
# Login no Doppler
doppler login

# Configurar projeto
doppler setup

# Configurar environment
doppler configure set project talent-sphere-registry
doppler configure set config dev
```

### **3. Scripts Automatizados**

**package.json:**
```json
{
  "scripts": {
    "doppler:dev": "doppler run -- npm run dev",
    "doppler:build": "doppler run -- npm run build", 
    "doppler:preview": "doppler run -- npm run preview",
    "doppler:setup": "node doppler-setup.js"
  }
}
```

### **4. Migração de Variáveis**

**Script de migração (doppler-setup.js):**
```javascript
const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔄 Migrando variáveis do .env para o Doppler...');

// Ler arquivo .env
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const envVars = envContent.split('\n').filter(line => line.includes('='));
  
  envVars.forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      try {
        execSync(`doppler secrets set ${key}="${value}"`, { stdio: 'inherit' });
        console.log(`✅ ${key} migrado com sucesso`);
      } catch (error) {
        console.error(`❌ Erro ao migrar ${key}:`, error.message);
      }
    }
  });
  
  console.log('🎉 Migração concluída!');
} else {
  console.log('❌ Arquivo .env não encontrado');
}
```

---

## 🌐 **Solução de Conectividade Supabase**

### **Problema Identificado:**
- **Erro:** `net::ERR_NAME_NOT_RESOLVED`
- **Causa:** Problemas de DNS/proxy local
- **Sintoma:** Terminal funcionava, navegador falhava

### **Solução Implementada:**

#### **1. Proxy Vite (vite.config.ts)**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080,
    proxy: {
      '/supabase-api': {
        target: 'https://pwksgdjjkryqryqrvyja.supabase.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/supabase-api/, ''),
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('🔄 Proxy error, tentando conectar via Supabase:', err.message);
          });
        },
      },
    },
  },
})
```

#### **2. Cliente Supabase com Fallback (src/lib/supabaseClient.ts)**

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cliente principal (direto)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Cliente proxy (fallback)
const proxyUrl = '/supabase-api';
export const supabaseProxy = createClient(proxyUrl, supabaseAnonKey);

// Função helper com fallback automático
export async function executeSupabaseQuery<T>(
  queryFn: (client: any) => Promise<T>
): Promise<T> {
  try {
    // Tentar conexão direta primeiro
    console.log('🔄 Tentando conexão direta com Supabase...');
    const result = await queryFn(supabase);
    console.log('✅ Conexão direta bem-sucedida');
    return result;
  } catch (error) {
    console.log('⚠️  Conexão direta falhou, tentando via proxy...');
    try {
      const result = await queryFn(supabaseProxy);
      console.log('✅ Conexão via proxy bem-sucedida');
      return result;
    } catch (proxyError) {
      console.error('❌ Ambas as conexões falharam:', { error, proxyError });
      throw proxyError;
    }
  }
}
```

#### **3. Implementação nos Componentes**

**Uso no Index.tsx:**
```typescript
import { executeSupabaseQuery } from '../lib/supabaseClient';

const fetchProfessionals = async () => {
  try {
    const result = await executeSupabaseQuery(async (client) => {
      const { data, error } = await client
        .from('colaboradores')
        .select('*');
      
      if (error) throw error;
      return data;
    });
    
    setProfessionals(result);
  } catch (error) {
    console.error('Erro:', error);
    // Fallback para dados mock
    setProfessionals(mockProfessionals);
  }
};
```

---

## 📊 **Estrutura do Banco Supabase**

### **Projeto Configurado:**
- **ID:** `pwksgdjjkryqryqrvyja`
- **Nome:** "Profissionais-HITSS"
- **URL:** `https://pwksgdjjkryqryqrvyja.supabase.co`
- **Região:** `sa-east-1` (São Paulo)

### **Tabelas:**

#### **1. colaboradores (Principal)**
- **Registros:** 115 profissionais
- **Campos:** 43 colunas
- **Tipos:** CLT: 50, PJ: 65

**Campos principais:**
```sql
- nome_completo
- email
- regime (CLT/PJ)
- proficiencia_cargo
- skill_principal
- nivel_experiencia
- disponivel_compartilhamento
- percentual_compartilhamento
```

#### **2. dre_hitss (Secundária)**
- **Registros:** 13.810 entradas
- **Propósito:** Dados de DRE/financeiro

---

## 🚀 **Como Executar o Projeto**

### **1. Desenvolvimento com Doppler:**
```bash
npm run doppler:dev
```

### **2. Build com Doppler:**
```bash
npm run doppler:build
```

### **3. Preview com Doppler:**
```bash
npm run doppler:preview
```

### **4. Configurar novo ambiente:**
```bash
npm run doppler:setup
```

---

## 🔍 **Troubleshooting**

### **Problema: Erro de DNS**
**Solução:** O proxy automático resolve o problema

### **Problema: Variáveis não carregadas**
**Solução:** 
```bash
doppler configure
doppler run -- npm run dev
```

### **Problema: Porta 8080 ocupada**
**Solução:** Vite automaticamente usa 8081

### **Verificar conectividade:**
```bash
# Testar via curl
curl -H "apikey: SUA_CHAVE" https://pwksgdjjkryqryqrvyja.supabase.co/rest/v1/colaboradores

# Verificar variáveis Doppler
doppler secrets
```

---

## 📁 **Estrutura de Arquivos**

```
talent-sphere-registry/
├── src/
│   ├── lib/
│   │   └── supabaseClient.ts     # Cliente com fallback
│   ├── pages/
│   │   └── Index.tsx             # Página principal
│   └── components/
│       └── Dashboard.tsx         # Dashboard com métricas
├── vite.config.ts                # Configuração do proxy
├── doppler-setup.js              # Script de migração
├── DOPPLER-MIGRATION.md          # Guia do Doppler
├── SUPABASE-SETUP.md            # Guia do Supabase
└── package.json                  # Scripts automatizados
```

---

## ✅ **Resultados Finais**

- ✅ **115 profissionais** carregados do Supabase real
- ✅ **Métricas reais:** CLT: 50, PJ: 65
- ✅ **Proxy funcionando** para contornar problemas de DNS
- ✅ **Doppler configurado** para segurança
- ✅ **Fallback automático** para dados mock se necessário
- ✅ **Interface responsiva** e funcional

---

## 🔐 **Segurança**

- **Doppler:** Gestão centralizada de segredos
- **Variáveis sensíveis:** Nunca commitadas no código
- **Chaves API:** Rotacionáveis via Doppler
- **Ambiente isolado:** Configurações por ambiente (dev/prod)

---

## 📞 **Suporte**

Para problemas ou dúvidas:
1. Verificar logs do console
2. Testar conectividade via curl
3. Verificar configuração do Doppler
4. Consultar esta documentação

**Status da aplicação:** ✅ **FUNCIONANDO COMPLETAMENTE** 