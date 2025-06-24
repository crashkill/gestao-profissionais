#!/usr/bin/env node

/**
 * 🔐 Script de Configuração Doppler para Talent Sphere Registry
 * 
 * Este script migra as variáveis do .env para o Doppler de forma segura
 * Baseado nas melhores práticas do DOPPLER-SETUP.md
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_NAME = 'talent-sphere-registry';
const CONFIG_NAME = 'dev';

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

async function main() {
  log('🚀 Configurando Doppler para Talent Sphere Registry', 'info');
  
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
  
  if (Object.keys(envVars).length === 0) {
    log('Nenhuma variável encontrada no .env', 'warning');
  } else {
    for (const [key, value] of Object.entries(envVars)) {
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
  
  // 7. Verificar configuração
  log('Verificando configuração final...', 'info');
  const secrets = runCommand(`doppler secrets --project ${PROJECT_NAME} --config ${CONFIG_NAME}`, 'Listagem de segredos');
  
  log('🎉 Configuração do Doppler concluída!', 'success');
  log('', 'info');
  log('📋 Próximos passos:', 'info');
  log('1. Use "npm run doppler:dev" em vez de "npm run dev"', 'info');
  log('2. Remova o arquivo .env (opcional, para maior segurança)', 'warning');
  log('3. Compartilhe o projeto com sua equipe no dashboard do Doppler', 'info');
  log('', 'info');
  log('🔗 Dashboard: https://dashboard.doppler.com/', 'info');
}

main().catch(error => {
  log('Erro durante a configuração', 'error');
  console.error(error);
  process.exit(1);
}); 