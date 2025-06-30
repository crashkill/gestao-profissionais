#!/usr/bin/env node

/**
 * 🔄 Script para Alternar Entre Ambientes
 * 
 * Permite trocar facilmente entre:
 * - desenvolvimento (local com homologação)
 * - homologacao (staging)
 * - producao (production)
 */

const fs = require('fs');
const path = require('path');

// Configurações dos ambientes disponíveis
const environments = {
  desenvolvimento: {
    file: 'config/desenvolvimento.env',
    description: '💻 Desenvolvimento Local (usa banco de homologação)',
    color: '\x1b[36m' // Cyan
  },
  homologacao: {
    file: 'config/homologacao.env',
    description: '🧪 Homologação/Staging (testes)',
    color: '\x1b[33m' // Yellow
  },
  producao: {
    file: 'config/producao.env',
    description: '🚀 Produção (ambiente final)',
    color: '\x1b[31m' // Red
  }
};

const resetColor = '\x1b[0m';

/**
 * Exibe banner do script
 */
function showBanner() {
  console.log('\n🔄 ========================================');
  console.log('   TALENT SPHERE - GERENCIADOR DE AMBIENTE');
  console.log('========================================\n');
}

/**
 * Lista os ambientes disponíveis
 */
function listEnvironments() {
  console.log('📋 Ambientes disponíveis:\n');
  
  Object.entries(environments).forEach(([key, config], index) => {
    console.log(`${config.color}${index + 1}. ${key}${resetColor}`);
    console.log(`   ${config.description}`);
    console.log(`   Arquivo: ${config.file}\n`);
  });
}

/**
 * Valida se o ambiente existe
 */
function validateEnvironment(env) {
  if (!environments[env]) {
    console.error(`❌ Ambiente '${env}' não encontrado!`);
    console.log('\n📋 Ambientes válidos:');
    Object.keys(environments).forEach(key => {
      console.log(`   - ${key}`);
    });
    process.exit(1);
  }
}

/**
 * Verifica se o arquivo de configuração existe
 */
function checkConfigFile(configPath) {
  if (!fs.existsSync(configPath)) {
    console.error(`❌ Arquivo de configuração não encontrado: ${configPath}`);
    process.exit(1);
  }
}

/**
 * Copia o arquivo de configuração para .env
 */
function switchEnvironment(targetEnv) {
  const config = environments[targetEnv];
  const sourcePath = path.resolve(config.file);
  const targetPath = path.resolve('.env');
  
  checkConfigFile(sourcePath);
  
  try {
    // Backup do .env atual se existir
    if (fs.existsSync(targetPath)) {
      const backupPath = `.env.backup.${Date.now()}`;
      fs.copyFileSync(targetPath, backupPath);
      console.log(`📁 Backup criado: ${backupPath}`);
    }
    
    // Copia o novo arquivo
    fs.copyFileSync(sourcePath, targetPath);
    
    console.log(`\n${config.color}✅ Ambiente alterado para: ${targetEnv.toUpperCase()}${resetColor}`);
    console.log(`📝 ${config.description}`);
    console.log(`📄 Arquivo copiado: ${config.file} → .env\n`);
    
    // Mostra as variáveis principais
    showCurrentConfig(targetPath);
    
    console.log('🔄 Reinicie o servidor de desenvolvimento para aplicar as mudanças!');
    
  } catch (error) {
    console.error('❌ Erro ao alterar ambiente:', error.message);
    process.exit(1);
  }
}

/**
 * Mostra a configuração atual
 */
function showCurrentConfig(envPath) {
  console.log('🔍 Configuração atual:');
  
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    
    const importantVars = ['VITE_SUPABASE_URL', 'VITE_ENVIRONMENT', 'VITE_APP_TITLE'];
    
    importantVars.forEach(varName => {
      const line = lines.find(l => l.startsWith(varName + '='));
      if (line) {
        const value = line.split('=')[1];
        if (varName === 'VITE_SUPABASE_URL') {
          // Exibe apenas os primeiros caracteres da URL
          console.log(`   ${varName}: ${value.substring(0, 30)}...`);
        } else {
          console.log(`   ${varName}: ${value}`);
        }
      }
    });
    
  } catch (error) {
    console.log('   (Não foi possível ler as configurações)');
  }
  
  console.log('');
}

/**
 * Função principal
 */
function main() {
  showBanner();
  
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    listEnvironments();
    console.log('💡 Uso: npm run env <ambiente>');
    console.log('   Exemplo: npm run env homologacao\n');
    return;
  }
  
  const targetEnv = args[0].toLowerCase();
  
  if (targetEnv === 'list' || targetEnv === 'ls') {
    listEnvironments();
    return;
  }
  
  validateEnvironment(targetEnv);
  switchEnvironment(targetEnv);
}

// Executa o script
if (require.main === module) {
  main();
}

module.exports = { switchEnvironment, environments }; 