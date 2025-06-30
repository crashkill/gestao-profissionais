#!/usr/bin/env node

/**
 * 🔐 CONFIGURAÇÃO DOPPLER - GESTÃO PROFISSIONAL HITSS
 * 
 * Este script configura automaticamente o Doppler para gerenciar
 * todos os secrets do projeto de forma segura.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_NAME = 'gestao-profissional';
const CONFIG_NAME = 'dev';

// 🔑 Variáveis que devem estar no Doppler
const REQUIRED_SECRETS = {
  // Supabase
  'VITE_SUPABASE_URL': 'URL do projeto Supabase (ex: https://your-project.supabase.co)',
  'VITE_SUPABASE_ANON_KEY': 'Chave anônima do Supabase',
  'SUPABASE_ACCESS_TOKEN': 'Token de acesso do Supabase para MCP',
  
  // APIs de IA
  'VITE_GROQ_API_KEY': 'Chave da API Groq',
  'VITE_TOGETHER_API_KEY': 'Chave da API Together.xyz',
  
  // MCP Servers
  'SMITHERY_API_KEY': 'Chave da API Smithery para sequential thinking',
  'MAGIC_21ST_API_KEY': 'Chave da API 21st.dev Magic',
  
  // Azure
  'AZURE_CLIENT_ID': 'Client ID do Azure',
  'AZURE_CLIENT_SECRET': 'Client Secret do Azure',
  'AZURE_TENANT_ID': 'Tenant ID do Azure',
  'AZURE_REGION': 'Região do Azure (ex: brazilsouth)',
  
  // Git Providers
  'GITHUB_PERSONAL_ACCESS_TOKEN': 'Token pessoal do GitHub',
  'GITLAB_PERSONAL_ACCESS_TOKEN': 'Token pessoal do GitLab',
  
  // Configurações
  'LOCALE': 'Locale do sistema (ex: pt-BR)',
  'TIMEZONE': 'Timezone (ex: America/Sao_Paulo)'
};

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    warning: '\x1b[33m',
    error: '\x1b[31m',
    reset: '\x1b[0m'
  };
  
  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };
  
  console.log(`${colors[type]}${icons[type]} ${message}${colors.reset}`);
}

function runCommand(command, description) {
  try {
    log(`Executando: ${description}`, 'info');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    log(`${description} - Concluído`, 'success');
    return output;
  } catch (error) {
    log(`Erro em: ${description}`, 'error');
    console.error(error.message);
    return null;
  }
}

function loadEnvFile() {
  const envPath = join(__dirname, '.env');
  
  if (!existsSync(envPath)) {
    log('Arquivo .env não encontrado', 'warning');
    return {};
  }
  
  const envContent = readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  return envVars;
}

function promptForSecrets() {
  log('', 'info');
  log('🔐 Configure os seguintes segredos no Doppler Dashboard:', 'warning');
  log('https://dashboard.doppler.com/', 'info');
  log('', 'info');
  
  Object.entries(REQUIRED_SECRETS).forEach(([key, description]) => {
    log(`${key}: ${description}`, 'info');
  });
  
  log('', 'info');
  log('💡 Dica: Use o comando abaixo para configurar individualmente:', 'info');
  log(`doppler secrets set NOME_VARIAVEL=valor --project ${PROJECT_NAME} --config ${CONFIG_NAME}`, 'info');
}

function createSecureMcpTemplate() {
  const secureMcpTemplate = {
    "mcpServers": {
      "playwright": {
        "command": "npx",
        "args": [
          "@playwright/mcp@latest",
          "--headless"
        ]
      },
      "puppeteer": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-puppeteer"
        ]
      },
      "server-sequential-thinking": {
        "command": "npx",
        "args": [
          "-y",
          "@smithery/cli@latest",
          "run",
          "@smithery-ai/server-sequential-thinking",
          "--key"
        ],
        "env": {
          "SMITHERY_API_KEY": "${SMITHERY_API_KEY}"
        }
      },
      "MCP-Supabase": {
        "command": "npx",
        "args": [
          "-y",
          "@supabase/mcp-server-supabase@latest",
          "--access-token"
        ],
        "env": {
          "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
        }
      },
      "browsermcp": {
        "command": "npx",
        "args": [
          "@browsermcp/mcp@latest"
        ]
      },
      "@21st-dev/magic": {
        "command": "npx",
        "args": [
          "-y",
          "@21st-dev/magic@latest"
        ],
        "env": {
          "API_KEY": "${MAGIC_21ST_API_KEY}"
        }
      },
      "azure-auth": {
        "command": "npx",
        "args": [
          "-y",
          "@azure/mcp@latest",
          "server",
          "start"
        ],
        "env": {
          "AZURE_CLIENT_ID": "${AZURE_CLIENT_ID}",
          "AZURE_CLIENT_SECRET": "${AZURE_CLIENT_SECRET}",
          "AZURE_TENANT_ID": "${AZURE_TENANT_ID}",
          "AZURE_REGION": "${AZURE_REGION}",
          "LOCALE": "${LOCALE}",
          "TIMEZONE": "${TIMEZONE}"
        },
        "enabled": true
      },
      "GitHub": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-github"
        ],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
        }
      },
      "gitlab": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-gitlab"
        ],
        "env": {
          "GITLAB_PERSONAL_ACCESS_TOKEN": "${GITLAB_PERSONAL_ACCESS_TOKEN}"
        }
      }
    }
  };
  
  const templatePath = join(__dirname, 'mcp-template-secure.json');
  writeFileSync(templatePath, JSON.stringify(secureMcpTemplate, null, 2));
  log(`Template seguro criado: ${templatePath}`, 'success');
}

async function main() {
  log('🚀 Configurando Doppler para Talent Sphere Registry', 'info');
  log('🔒 Migrando TODOS os segredos para o Doppler', 'warning');
  
  // 1. Verificar se Doppler está instalado
  log('Verificando instalação do Doppler...', 'info');
  const dopplerVersion = runCommand('doppler --version', 'Verificação do Doppler');
  if (!dopplerVersion) {
    log('Doppler não está instalado. Instale com: brew install dopplerhq/cli/doppler', 'error');
    process.exit(1);
  }
  
  // 2. Fazer login (se necessário)
  log('Verificando autenticação...', 'info');
  try {
    execSync('doppler me', { stdio: 'pipe' });
    log('Usuário já autenticado', 'success');
  } catch {
    log('Fazendo login no Doppler...', 'warning');
    runCommand('doppler login', 'Login no Doppler');
  }
  
  // 3. Criar projeto se não existir
  log(`Configurando projeto ${PROJECT_NAME}...`, 'info');
  try {
    execSync(`doppler projects get ${PROJECT_NAME}`, { stdio: 'pipe' });
    log('Projeto já existe', 'success');
  } catch {
    log('Criando novo projeto...', 'info');
    runCommand(`doppler projects create ${PROJECT_NAME}`, 'Criação do projeto');
  }
  
  // 4. Criar configuração dev se não existir
  log(`Configurando ambiente ${CONFIG_NAME}...`, 'info');
  try {
    execSync(`doppler configs get ${CONFIG_NAME} --project ${PROJECT_NAME}`, { stdio: 'pipe' });
    log('Configuração dev já existe', 'success');
  } catch {
    log('Criando configuração dev...', 'info');
    runCommand(`doppler configs create ${CONFIG_NAME} --project ${PROJECT_NAME}`, 'Criação da configuração dev');
  }
  
  // 5. Configurar o diretório atual
  log('Vinculando diretório ao projeto...', 'info');
  runCommand(`doppler setup --project ${PROJECT_NAME} --config ${CONFIG_NAME}`, 'Configuração local');
  
  // 6. Migrar variáveis do .env
  log('Migrando variáveis do .env...', 'info');
  const envVars = loadEnvFile();
  
  if (Object.keys(envVars).length > 0) {
    for (const [key, value] of Object.entries(envVars)) {
      if (value && !value.includes('your_') && !value.includes('${')) {
        try {
          runCommand(
            `doppler secrets set "${key}=${value}" --project ${PROJECT_NAME} --config ${CONFIG_NAME}`,
            `Configurando ${key}`
          );
        } catch (error) {
          log(`Erro ao configurar ${key}`, 'error');
        }
      }
    }
  }
  
  // 7. Configurar variáveis padrão (não sensíveis)
  const defaultVars = {
    'AZURE_REGION': 'brazilsouth',
    'LOCALE': 'pt-BR',
    'TIMEZONE': 'America/Sao_Paulo'
  };
  
  for (const [key, value] of Object.entries(defaultVars)) {
    try {
      runCommand(
        `doppler secrets set "${key}=${value}" --project ${PROJECT_NAME} --config ${CONFIG_NAME}`,
        `Configurando padrão ${key}`
      );
    } catch (error) {
      log(`Erro ao configurar ${key}`, 'error');
    }
  }
  
  // 8. Criar template seguro do MCP
  createSecureMcpTemplate();
  
  // 9. Verificar configuração
  log('Verificando configuração final...', 'info');
  const secrets = runCommand(`doppler secrets --project ${PROJECT_NAME} --config ${CONFIG_NAME}`, 'Listagem de segredos');
  
  log('🎉 Configuração básica do Doppler concluída!', 'success');
  log('', 'info');
  
  // 10. Mostrar instruções para configurar segredos
  promptForSecrets();
  
  log('📋 Próximos passos:', 'info');
  log('1. Configure todos os segredos listados acima no Doppler Dashboard', 'warning');
  log('2. Use "doppler run -- npm run dev" para executar com as variáveis do Doppler', 'info');
  log('3. Substitua mcp.json por mcp-template-secure.json após configurar as variáveis', 'info');
  log('4. Remova arquivos .env e segredos hardcoded', 'warning');
  log('', 'info');
  log('🔗 Dashboard: https://dashboard.doppler.com/', 'info');
}

main().catch(error => {
  log('Erro durante a configuração', 'error');
  console.error(error);
  process.exit(1);
}); 