# Configuração MCP - Talent Sphere Registry

## 🎯 Objetivo

O script `setup-mcp.js` automatiza a configuração do arquivo `mcp.json` para diferentes ambientes e necessidades, tornando o projeto mais portável e fácil de configurar.

## 🚀 Como Usar

### Método 1: Via NPM (Recomendado)
```bash
npm run mcp:setup
```

### Método 2: Execução Direta
```bash
node setup-mcp.js
```

## 📋 Opções Disponíveis

### 1️⃣ MCP Padrão
- **Arquivo:** `mcp.json` (original)
- **Uso:** Ambiente de desenvolvimento local
- **Características:** Configuração básica sem modificações

### 2️⃣ MCP Portável
- **Arquivo:** `mcp-portable.json`
- **Uso:** Ambientes multiplataforma
- **Características:**
  - Comandos `npx` padronizados
  - Compatível com Windows, Mac e Linux
  - Não depende de Docker local

### 3️⃣ MCP com Variáveis de Ambiente
- **Arquivo:** `mcp-env-template.json`
- **Uso:** Ambientes de produção/staging
- **Características:**
  - Tokens e credenciais em variáveis de ambiente
  - Mais seguro para deploy
  - Cria automaticamente o arquivo `mcp.env`

### 4️⃣ Detecção Automática
- **Uso:** Deixa o script decidir a melhor opção
- **Lógica:**
  - macOS/Linux + NPX disponível → MCP Portável
  - Windows → MCP com Variáveis de Ambiente
  - Outros casos → MCP Padrão

## 🔧 Funcionalidades

### ✅ Detecção de Ambiente
- Identifica sistema operacional
- Verifica disponibilidade de Docker
- Verifica disponibilidade de NPX

### ✅ Backup Automático
- Cria backup do `mcp.json` existente
- Formato: `mcp.json.backup.YYYY-MM-DDTHH-MM-SS`

### ✅ Configuração de Ambiente
- Cria arquivo `mcp.env` quando necessário
- Copia template de `mcp.env.example`
- Avisa sobre configuração de variáveis

### ✅ Interface Colorida
- Output colorido para melhor experiência
- Emojis para identificação rápida
- Mensagens claras de status

## 🛠️ Estrutura de Arquivos

```
talent-sphere-registry/
├── mcp.json                 # Arquivo ativo (gerado pelo script)
├── mcp-portable.json        # Template portável
├── mcp-env-template.json    # Template com variáveis de ambiente
├── mcp.env.example          # Exemplo de variáveis de ambiente
├── mcp.env                  # Variáveis de ambiente (criado automaticamente)
├── setup-mcp.js             # Script de configuração
└── mcp.json.backup.*        # Backups automáticos
```

## 📝 Exemplo de Uso

```bash
$ npm run mcp:setup

🚀 Bem-vindo ao Configurador MCP!

🔧 Configurador MCP - Talent Sphere Registry
==================================================

Opções disponíveis:
1️⃣  MCP Padrão (mcp.json original)
2️⃣  MCP Portável (comandos npx padronizados)
3️⃣  MCP com Variáveis de Ambiente (mais seguro)
4️⃣  Detectar automaticamente
5️⃣  Cancelar

🔥 Escolha uma opção (1-5): 4

🔍 Detectando ambiente...
Platform: darwin
Docker: ✅
NPX: ✅

💡 Recomendação: MCP Portável (npx padronizado)

Confirmar instalação? (S/n): s

📦 Backup criado: mcp.json.backup.2024-01-15T10-30-45-123Z
✅ MCP Portável instalado como mcp.json!

🎉 Configuração concluída com sucesso!

📋 Próximos passos:
   1. Verifique o arquivo mcp.json gerado
   4. Teste a configuração MCP
```

## 🔒 Segurança

### Variáveis de Ambiente (Opção 3)
Quando usar a opção com variáveis de ambiente, configure:

```bash
# mcp.env
SUPABASE_URL=sua_url_aqui
SUPABASE_ANON_KEY=sua_chave_aqui
GITHUB_TOKEN=seu_token_aqui
AZURE_SUBSCRIPTION_ID=seu_subscription_id
```

### ⚠️ Importante
- Adicione `mcp.env` ao `.gitignore`
- Nunca commite credenciais reais
- Use tokens com escopo mínimo necessário

## 🐛 Troubleshooting

### Erro: "Arquivo não encontrado"
```bash
# Verifique se os templates existem
ls -la mcp*.json

# Se não existirem, baixe do repositório
git pull origin main
```

### Erro: "Permissão negada"
```bash
# Dê permissão de execução
chmod +x setup-mcp.js

# Ou execute com Node diretamente
node setup-mcp.js
```

### Restaurar Backup
```bash
# Listar backups disponíveis
ls -la mcp.json.backup.*

# Restaurar um backup específico
cp mcp.json.backup.2024-01-15T10-30-45-123Z mcp.json
```

## 🔄 Atualizações

Para atualizar os templates MCP:
```bash
git pull origin main
npm run mcp:setup
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se todos os arquivos template existem
2. Confirme as permissões de arquivo
3. Teste em um ambiente limpo
4. Consulte os logs de erro detalhados

---

**Desenvolvido para o projeto Talent Sphere Registry - HITSS** 