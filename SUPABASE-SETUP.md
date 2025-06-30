# 🗄️ **Configuração do Supabase - Talent Sphere Registry**

## 🚨 **PROBLEMA ATUAL**

**❌ ERRO IDENTIFICADO:**
```
Index.tsx:35 Erro ao buscar profissionais do Supabase
Could not resolve host: pwksgdjjkryqryqrvyja.supabase.co
```

**🔍 CAUSA:**
A URL do Supabase configurada é inválida/fictícia.

## 🛠️ **SOLUÇÃO COMPLETA**

### 1. **Criar Projeto Real no Supabase**

1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Clique em **"New Project"**
3. Configure:
   - **Name:** `talent-sphere-registry`
   - **Organization:** Sua organização
   - **Database Password:** Senha segura
   - **Region:** `South America (São Paulo)` ou mais próximo

### 2. **Obter Credenciais Reais**

Após criar o projeto:

1. Vá em **Settings > API**
2. Copie:
   - **Project URL:** `https://[SEU-ID].supabase.co`
   - **anon/public key:** Chave JWT anônima (regenerar após vazamento)

### 3. **Atualizar Credenciais no Doppler**

```bash
# Atualizar URL real do Supabase
doppler secrets set VITE_SUPABASE_URL="https://SEU-PROJETO-REAL.supabase.co"

# Atualizar chave real do Supabase
doppler secrets set VITE_SUPABASE_ANON_KEY="sua_chave_real_aqui"

# Verificar se foi atualizado
doppler secrets
```

### 4. **Criar Tabela `colaboradores`**

No Supabase Dashboard:

1. Vá em **Table Editor**
2. Clique em **"Create a new table"**
3. Configure:

```sql
-- Nome da tabela: colaboradores
CREATE TABLE colaboradores (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  nome_completo TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  area_atuacao TEXT NOT NULL,
  skill_principal TEXT NOT NULL,
  nivel_experiencia TEXT NOT NULL,
  disponivel_compartilhamento BOOLEAN DEFAULT false,
  percentual_compartilhamento INTEGER DEFAULT 0,
  outras_skills TEXT[]
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE colaboradores ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Enable read access for all users" ON colaboradores
FOR SELECT USING (true);

-- Política para permitir inserção pública  
CREATE POLICY "Enable insert for all users" ON colaboradores
FOR INSERT WITH CHECK (true);
```

### 5. **Testar Conexão**

```bash
# Reiniciar aplicação com novas credenciais
npm run doppler:dev
```

## 📋 **ESTRUTURA DA TABELA**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | BIGSERIAL | ID único (auto-incremento) |
| `created_at` | TIMESTAMPTZ | Data de criação |
| `nome_completo` | TEXT | Nome completo do profissional |
| `email` | TEXT | Email (único) |
| `area_atuacao` | TEXT | Área de atuação |
| `skill_principal` | TEXT | Skill principal |
| `nivel_experiencia` | TEXT | Nível (Júnior/Pleno/Sênior) |
| `disponivel_compartilhamento` | BOOLEAN | Disponível para compartilhamento |
| `percentual_compartilhamento` | INTEGER | Percentual de compartilhamento |
| `outras_skills` | TEXT[] | Array de outras skills |

## 🔒 **CONFIGURAÇÃO DE SEGURANÇA**

### **Row Level Security (RLS):**
```sql
-- Visualizar políticas atuais
SELECT * FROM pg_policies WHERE tablename = 'colaboradores';

-- Política mais restritiva (opcional)
CREATE POLICY "Restrict by domain" ON colaboradores
FOR ALL USING (email LIKE '%@hitss.com.br' OR email LIKE '%@globalhitss.com.br');
```

## 🧪 **TESTAR CONFIGURAÇÃO**

### **1. Via Curl:**
```bash
curl "https://SEU-PROJETO.supabase.co/rest/v1/colaboradores" \
  -H "apikey: SUA-CHAVE-AQUI" \
  -H "Authorization: Bearer SUA-CHAVE-AQUI"
```

### **2. Via Aplicação:**
```bash
npm run doppler:dev
# Acessar http://localhost:8080
# Verificar se não há erros no console
```

## 🚀 **DADOS DE TESTE**

Para popular a tabela com dados de teste:

```sql
INSERT INTO colaboradores (
  nome_completo, 
  email, 
  area_atuacao, 
  skill_principal, 
  nivel_experiencia,
  disponivel_compartilhamento,
  percentual_compartilhamento,
  outras_skills
) VALUES 
('João Silva', 'joao.silva@hitss.com.br', 'Desenvolvedor Frontend', 'React', 'Pleno', true, 75, ARRAY['JavaScript', 'TypeScript']),
('Maria Santos', 'maria.santos@hitss.com.br', 'Desenvolvedor Backend', 'Node.js', 'Sênior', true, 50, ARRAY['Express', 'MongoDB']),
('Pedro Costa', 'pedro.costa@hitss.com.br', 'DevOps', 'AWS', 'Pleno', false, 0, ARRAY['Docker', 'Kubernetes']);
```

## ✅ **VERIFICAÇÃO FINAL**

Após configuração:
- [ ] Projeto Supabase criado
- [ ] Credenciais reais no Doppler
- [ ] Tabela `colaboradores` criada
- [ ] Políticas RLS configuradas
- [ ] Aplicação funcionando sem erros
- [ ] Dados carregando na interface

---

**🎯 Resultado:** Conexão Supabase funcionando 100%! 