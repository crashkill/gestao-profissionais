#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = 'reset') {
  console.log(colorize(message, color));
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(colorize(prompt, 'cyan'), resolve);
  });
}

async function detectEnvironment() {
  const platform = process.platform;
  const hasDocker = fs.existsSync('/usr/bin/docker') || fs.existsSync('/usr/local/bin/docker');
  const hasNpx = fs.existsSync('/usr/local/bin/npx') || fs.existsSync('/usr/bin/npx');
  
  return {
    platform,
    hasDocker,
    hasNpx
  };
}

async function copyFile(source, destination) {
  try {
    const content = fs.readFileSync(source, 'utf8');
    fs.writeFileSync(destination, content);
    return true;
  } catch (error) {
    log(`❌ Erro ao copiar ${source}: ${error.message}`, 'red');
    return false;
  }
}

async function createEnvFile() {
  const envExample = 'mcp.env.example';
  const envFile = 'mcp.env';
  
  if (!fs.existsSync(envExample)) {
    log('❌ Arquivo mcp.env.example não encontrado!', 'red');
    return false;
  }
  
  if (fs.existsSync(envFile)) {
    const overwrite = await question(`📁 Arquivo mcp.env já existe. Sobrescrever? (s/N): `);
    if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
      log('✅ Mantendo arquivo mcp.env existente', 'yellow');
      return true;
    }
  }
  
  const success = await copyFile(envExample, envFile);
  if (success) {
    log('✅ Arquivo mcp.env criado com sucesso!', 'green');
    log('⚠️  Lembre-se de configurar suas variáveis de ambiente no arquivo mcp.env', 'yellow');
  }
  
  return success;
}

async function showMcpOptions() {
  log('\n' + colorize('🔧 Configurador MCP - Talent Sphere Registry', 'bright'));
  log(colorize('=' .repeat(50), 'blue'));
  
  log('\nOpções disponíveis:');
  log('1️⃣  MCP Padrão (mcp.json original)');
  log('2️⃣  MCP Portável (comandos npx padronizados)');
  log('3️⃣  MCP com Variáveis de Ambiente (mais seguro)');
  log('4️⃣  Detectar automaticamente');
  log('5️⃣  Cancelar');
}

async function installMcp(option, env) {
  const mcpFiles = {
    '1': { source: 'mcp.json', name: 'MCP Padrão' },
    '2': { source: 'mcp-portable.json', name: 'MCP Portável' },
    '3': { source: 'mcp-env-template.json', name: 'MCP com Variáveis de Ambiente' }
  };
  
  const selectedMcp = mcpFiles[option];
  if (!selectedMcp) {
    log('❌ Opção inválida!', 'red');
    return false;
  }
  
  // Verificar se o arquivo fonte existe
  if (!fs.existsSync(selectedMcp.source)) {
    log(`❌ Arquivo ${selectedMcp.source} não encontrado!`, 'red');
    return false;
  }
  
  // Backup do mcp.json existente se houver
  if (fs.existsSync('mcp.json')) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `mcp.json.backup.${timestamp}`;
    fs.copyFileSync('mcp.json', backupName);
    log(`📦 Backup criado: ${backupName}`, 'yellow');
  }
  
  // Copiar o arquivo selecionado
  const success = await copyFile(selectedMcp.source, 'mcp.json');
  if (success) {
    log(`✅ ${selectedMcp.name} instalado como mcp.json!`, 'green');
    
    // Se for a opção com variáveis de ambiente, criar o arquivo .env
    if (option === '3') {
      await createEnvFile();
    }
    
    return true;
  }
  
  return false;
}

async function autoDetect() {
  const env = await detectEnvironment();
  
  log('\n🔍 Detectando ambiente...');
  log(`Platform: ${env.platform}`);
  log(`Docker: ${env.hasDocker ? '✅' : '❌'}`);
  log(`NPX: ${env.hasNpx ? '✅' : '❌'}`);
  
  // Lógica de detecção
  if (env.hasNpx && env.platform !== 'win32') {
    log('\n💡 Recomendação: MCP Portável (npx padronizado)', 'green');
    return '2';
  } else if (env.platform === 'win32') {
    log('\n💡 Recomendação: MCP com Variáveis de Ambiente (Windows)', 'green');
    return '3';
  } else {
    log('\n💡 Recomendação: MCP Padrão', 'green');
    return '1';
  }
}

async function main() {
  try {
    log(colorize('\n🚀 Bem-vindo ao Configurador MCP!', 'bright'));
    
    const env = await detectEnvironment();
    
    await showMcpOptions();
    
    const choice = await question('\n🔥 Escolha uma opção (1-5): ');
    
    let selectedOption = choice;
    
    if (choice === '4') {
      selectedOption = await autoDetect();
      const confirm = await question(`\n🔥 Confirmar instalação? (S/n): `);
      if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'nao') {
        log('❌ Instalação cancelada', 'yellow');
        rl.close();
        return;
      }
    } else if (choice === '5') {
      log('❌ Instalação cancelada', 'yellow');
      rl.close();
      return;
    }
    
    const success = await installMcp(selectedOption, env);
    
    if (success) {
      log('\n🎉 Configuração concluída com sucesso!', 'green');
      log('\n📋 Próximos passos:');
      log('   1. Verifique o arquivo mcp.json gerado');
      if (selectedOption === '3') {
        log('   2. Configure suas variáveis no arquivo mcp.env');
        log('   3. Adicione mcp.env ao .gitignore se necessário');
      }
      log('   4. Teste a configuração MCP');
    } else {
      log('\n❌ Falha na configuração. Verifique os arquivos e tente novamente.', 'red');
    }
    
  } catch (error) {
    log(`\n❌ Erro inesperado: ${error.message}`, 'red');
  } finally {
    rl.close();
  }
}

// Verificar se está sendo executado diretamente
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}

export { main, detectEnvironment, installMcp }; 