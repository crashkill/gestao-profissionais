#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
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

class SecurityValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.projectRoot = process.cwd();
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(`❌ ERROR: ${message}`, 'red');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(`⚠️  WARNING: ${message}`, 'yellow');
  }

  addInfo(message) {
    this.info.push(message);
    this.log(`ℹ️  INFO: ${message}`, 'blue');
  }

  // Check if essential files exist
  checkEssentialFiles() {
    this.log('\n🔍 Verificando arquivos essenciais...', 'cyan');
    
    const essentialFiles = [
      '.gitignore',
      'package.json',
      'src/lib/supabaseClient.ts',
      'SECURITY.md'
    ];

    essentialFiles.forEach(file => {
      const filePath = path.join(this.projectRoot, file);
      if (!fs.existsSync(filePath)) {
        this.addError(`Arquivo essencial ausente: ${file}`);
      } else {
        this.addInfo(`Arquivo encontrado: ${file}`);
      }
    });
  }

  // Check .gitignore for security patterns
  checkGitignore() {
    this.log('\n🔍 Verificando .gitignore...', 'cyan');
    
    const gitignorePath = path.join(this.projectRoot, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      this.addError('.gitignore não encontrado');
      return;
    }

    const content = fs.readFileSync(gitignorePath, 'utf8');
    const requiredPatterns = [
      '.env',
      '*.key',
      '*.pem',
      '*secret*',
      '*token*'
    ];

    requiredPatterns.forEach(pattern => {
      if (!content.includes(pattern)) {
        this.addWarning(`Padrão de segurança ausente no .gitignore: ${pattern}`);
      } else {
        this.addInfo(`Padrão de segurança encontrado: ${pattern}`);
      }
    });
  }

  // Check for hardcoded secrets in common files
  checkHardcodedSecrets() {
    this.log('\n🔍 Verificando segredos hardcoded...', 'cyan');
    
    const filesToCheck = [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx',
      '*.ts',
      '*.js'
    ];

    const secretPatterns = [
      { name: 'JWT Token', pattern: /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/ },
      { name: 'OpenAI Key', pattern: /sk-[a-zA-Z0-9]{48}/ },
      { name: 'Groq Key', pattern: /gsk_[a-zA-Z0-9]+/ },
      { name: 'API Key Generic', pattern: /[Aa][Pp][Ii]_?[Kk][Ee][Yy]\s*[:=]\s*["'][^"']+["']/ },
      { name: 'Password', pattern: /[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]\s*[:=]\s*["'][^"']+["']/ }
    ];

    this.scanFilesForPatterns(filesToCheck, secretPatterns);
  }

  scanFilesForPatterns(filePatterns, secretPatterns) {
    
    try {
      // Use find to get files, excluding node_modules, .git and dist
      const findCommand = `find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .git | grep -v dist | head -20`;
      const files = execSync(findCommand, { encoding: 'utf8' }).trim().split('\n').filter(f => f);

      let foundSecrets = 0;

      files.forEach(file => {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          
          secretPatterns.forEach(({ name, pattern }) => {
            const matches = content.match(pattern);
            if (matches) {
              foundSecrets++;
              this.addError(`${name} encontrado em ${file}: ${matches[0].substring(0, 20)}...`);
            }
          });
        }
      });

      if (foundSecrets === 0) {
        this.addInfo('Nenhum segredo hardcoded encontrado nos arquivos verificados');
      }

    } catch (error) {
      this.addWarning(`Erro ao verificar arquivos: ${error.message}`);
    }
  }

  // Check environment variable usage
  checkEnvironmentVariables() {
    this.log('\n🔍 Verificando uso de variáveis de ambiente...', 'cyan');
    
    const supabaseClientPath = path.join(this.projectRoot, 'src/lib/supabaseClient.ts');
    if (fs.existsSync(supabaseClientPath)) {
      const content = fs.readFileSync(supabaseClientPath, 'utf8');
      
      if (content.includes('import.meta.env.VITE_SUPABASE_URL')) {
        this.addInfo('Variável VITE_SUPABASE_URL sendo usada corretamente');
      } else {
        this.addError('VITE_SUPABASE_URL não encontrada no supabaseClient.ts');
      }

      if (content.includes('import.meta.env.VITE_SUPABASE_ANON_KEY')) {
        this.addInfo('Variável VITE_SUPABASE_ANON_KEY sendo usada corretamente');
      } else {
        this.addError('VITE_SUPABASE_ANON_KEY não encontrada no supabaseClient.ts');
      }
    }
  }

  // Check package.json security scripts
  checkSecurityScripts() {
    this.log('\n🔍 Verificando scripts de segurança...', 'cyan');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    if (fs.existsSync(packagePath)) {
      const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      const scripts = pkg.scripts || {};

      const requiredScripts = [
        'secure:scan',
        'secure:check',
        'secure:test'
      ];

      requiredScripts.forEach(script => {
        if (scripts[script]) {
          this.addInfo(`Script de segurança encontrado: ${script}`);
        } else {
          this.addWarning(`Script de segurança ausente: ${script}`);
        }
      });
    }
  }

  // Check for common security vulnerabilities
  checkCommonVulnerabilities() {
    this.log('\n🔍 Verificando vulnerabilidades comuns...', 'cyan');
    
    // Check for eval usage
    try {
      const evalCheck = execSync('grep -r "eval(" src/ 2>/dev/null || true', { encoding: 'utf8' });
      
      if (evalCheck.trim()) {
        this.addError('Uso de eval() detectado - potencial vulnerabilidade de segurança');
      } else {
        this.addInfo('Nenhum uso de eval() detectado');
      }
    } catch (error) {
      // Ignore errors in this check
    }

    // Check for console.log in production files
    try {
      const consoleCheck = execSync('grep -r "console.log" src/ 2>/dev/null | wc -l', { encoding: 'utf8' });
      const count = parseInt(consoleCheck.trim());
      
      if (count > 10) {
        this.addWarning(`Muitos console.log encontrados (${count}) - considere remover em produção`);
      } else if (count > 0) {
        this.addInfo(`${count} console.log encontrados - dentro do aceitável`);
      }
    } catch (error) {
      // Ignore errors in this check
    }
  }

  // Run all security checks
  async runAllChecks() {
    this.log('🛡️  INICIANDO VALIDAÇÃO DE SEGURANÇA', 'green');
    this.log('=' * 50, 'green');

    this.checkEssentialFiles();
    this.checkGitignore();
    this.checkHardcodedSecrets();
    this.checkEnvironmentVariables();
    this.checkSecurityScripts();
    this.checkCommonVulnerabilities();

    this.generateReport();
  }

  generateReport() {
    this.log('\n' + '='.repeat(50), 'magenta');
    this.log('📊 RELATÓRIO DE SEGURANÇA', 'magenta');
    this.log('='.repeat(50), 'magenta');

    this.log(`\n✅ Informações: ${this.info.length}`, 'green');
    this.log(`⚠️  Avisos: ${this.warnings.length}`, 'yellow');
    this.log(`❌ Erros: ${this.errors.length}`, 'red');

    let securityScore = 100;
    securityScore -= this.errors.length * 20;
    securityScore -= this.warnings.length * 5;
    securityScore = Math.max(0, securityScore);

    this.log(`\n🎯 Pontuação de Segurança: ${securityScore}/100`, 
      securityScore >= 80 ? 'green' : securityScore >= 60 ? 'yellow' : 'red');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      this.log('\n🎉 PARABÉNS! Nenhum problema de segurança encontrado!', 'green');
    } else if (this.errors.length === 0) {
      this.log('\n✅ Nenhum erro crítico encontrado. Revisar avisos.', 'yellow');
    } else {
      this.log('\n🚨 ATENÇÃO! Problemas de segurança encontrados que precisam ser corrigidos!', 'red');
    }

    // Exit with appropriate code
    if (this.errors.length > 0) {
      process.exit(1);
    } else if (this.warnings.length > 0) {
      process.exit(0); // Warnings are not fatal
    } else {
      process.exit(0);
    }
  }
}

// Run the validator
const validator = new SecurityValidator();
validator.runAllChecks(); 