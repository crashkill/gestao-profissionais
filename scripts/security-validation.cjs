#!/usr/bin/env node

/**
 * 🛡️ Security Validation Script
 * Valida a segurança do projeto considerando vulnerabilidades conhecidas
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Cores para output
const colors = {
  red: '\\x1b[31m',
  green: '\\x1b[32m',
  yellow: '\\x1b[33m',
  blue: '\\x1b[34m',
  magenta: '\\x1b[35m',
  cyan: '\\x1b[36m',
  reset: '\\x1b[0m',
  bright: '\\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

class SecurityValidator {
  constructor() {
    this.score = 100;
    this.issues = [];
    this.warnings = [];
    this.allowlist = this.loadVulnerabilityAllowlist();
  }

  loadVulnerabilityAllowlist() {
    try {
      const allowlistPath = path.join(process.cwd(), '.github', 'vulnerability-allowlist.json');
      if (fs.existsSync(allowlistPath)) {
        const content = fs.readFileSync(allowlistPath, 'utf8');
        return JSON.parse(content);
      }
    } catch (error) {
      log(`⚠️ Failed to load vulnerability allowlist: ${error.message}`, 'yellow');
    }
    return { allowedVulnerabilities: {}, securityPolicy: {} };
  }

  async validateSecrets() {
    log('🔍 Verificando exposição de segredos...', 'blue');
    
    try {
      // Verifica por tokens expostos
      execSync('npm run secure:scan', { stdio: 'pipe' });
      log('  ✅ Nenhum segredo exposto encontrado', 'green');
    } catch (error) {
      this.issues.push('Segredos expostos encontrados');
      this.score -= 30;
      log('  ❌ Segredos expostos encontrados!', 'red');
    }
  }

  async validateEnvironment() {
    log('🔧 Verificando configuração de ambiente...', 'blue');
    
    try {
      execSync('npm run secure:check', { stdio: 'pipe' });
      log('  ✅ Configuração de ambiente segura', 'green');
    } catch (error) {
      this.issues.push('Problemas na configuração de ambiente');
      this.score -= 15;
      log('  ⚠️ Problemas na configuração de ambiente', 'yellow');
    }
  }

  async validateDependencies() {
    log('📦 Verificando dependências...', 'blue');
    
    try {
      const auditOutput = execSync('npm audit --json', { stdio: 'pipe', encoding: 'utf8' });
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.vulnerabilities) {
        const vulnerabilities = Object.entries(auditData.vulnerabilities);
        let fixableCount = 0;
        let allowedCount = 0;
        
        for (const [pkgName, vulnData] of vulnerabilities) {
          if (this.isVulnerabilityAllowed(pkgName, vulnData)) {
            allowedCount++;
            log(`  📋 ${pkgName}: Vulnerabilidade conhecida (permitida)`, 'cyan');
          } else if (vulnData.fixAvailable) {
            fixableCount++;
            this.issues.push(`Vulnerabilidade corrigível em ${pkgName}`);
          } else {
            this.warnings.push(`Vulnerabilidade sem correção em ${pkgName}`);
          }
        }
        
        if (fixableCount > 0) {
          this.score -= (fixableCount * 10);
          log(`  ❌ ${fixableCount} vulnerabilidades corrigíveis encontradas`, 'red');
        }
        
        if (allowedCount > 0) {
          log(`  📋 ${allowedCount} vulnerabilidades conhecidas (permitidas)`, 'cyan');
        }
        
        if (fixableCount === 0 && vulnerabilities.length > 0) {
          log(`  ✅ Apenas vulnerabilidades conhecidas/permitidas`, 'green');
        }
      } else {
        log('  ✅ Nenhuma vulnerabilidade encontrada', 'green');
      }
    } catch (error) {
      // Se npm audit falhar, ainda podemos continuar
      log('  ⚠️ Erro ao executar auditoria de dependências', 'yellow');
    }
  }

  isVulnerabilityAllowed(packageName, vulnData) {
    const allowedVulns = this.allowlist.allowedVulnerabilities || {};
    
    if (allowedVulns[packageName]) {
      const allowed = allowedVulns[packageName];
      
      // Verifica se a vulnerabilidade está na lista de permitidas
      if (allowed.status === 'accepted' || allowed.status === 'accepted-with-monitoring') {
        return true;
      }
    }
    
    return false;
  }

  async validateBuildSecurity() {
    log('🏗️ Verificando segurança do build...', 'blue');
    
    const distPath = path.join(process.cwd(), 'dist');
    
    if (!fs.existsSync(distPath)) {
      log('  ⚠️ Diretório dist não encontrado', 'yellow');
      return;
    }

    try {
      // Verifica por secrets no build
      execSync(`grep -r "eyJ[A-Za-z0-9_-]*" ${distPath}`, { stdio: 'pipe' });
      this.issues.push('JWT tokens encontrados no build');
      this.score -= 25;
      log('  ❌ JWT tokens encontrados no build!', 'red');
    } catch (error) {
      log('  ✅ Nenhum JWT token no build', 'green');
    }

    try {
      // Verifica por API keys no build
      execSync(`grep -r "sk-[a-zA-Z0-9]" ${distPath}`, { stdio: 'pipe' });
      this.issues.push('API keys encontradas no build');
      this.score -= 25;
      log('  ❌ API keys encontradas no build!', 'red');
    } catch (error) {
      log('  ✅ Nenhuma API key no build', 'green');
    }
  }

  async validateGitSecurity() {
    log('📂 Verificando segurança do Git...', 'blue');
    
    // Verifica por arquivos sensíveis no Git
    const sensitiveFiles = ['.env', '.env.local', '.env.production', 'secrets.json'];
    let foundSensitive = false;
    
    for (const file of sensitiveFiles) {
      try {
        execSync(`git ls-files | grep "${file}"`, { stdio: 'pipe' });
        this.issues.push(`Arquivo sensível no Git: ${file}`);
        this.score -= 20;
        foundSensitive = true;
        log(`  ❌ Arquivo sensível encontrado: ${file}`, 'red');
      } catch (error) {
        // Arquivo não encontrado no Git (bom)
      }
    }
    
    if (!foundSensitive) {
      log('  ✅ Nenhum arquivo sensível no Git', 'green');
    }
  }

  generateReport() {
    log('\\n' + '='.repeat(60), 'cyan');
    log('🛡️ RELATÓRIO DE SEGURANÇA', 'bright');
    log('='.repeat(60), 'cyan');
    
    // Score
    const scoreColor = this.score >= 90 ? 'green' : this.score >= 80 ? 'yellow' : 'red';
    log(`🎯 Pontuação de Segurança: ${this.score}/100`, scoreColor);
    
    // Issues críticos
    if (this.issues.length > 0) {
      log('\\n❌ PROBLEMAS CRÍTICOS:', 'red');
      this.issues.forEach(issue => log(`  • ${issue}`, 'red'));
    }
    
    // Warnings
    if (this.warnings.length > 0) {
      log('\\n⚠️ AVISOS:', 'yellow');
      this.warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
    }
    
    // Recomendações
    log('\\n💡 RECOMENDAÇÕES:', 'blue');
    if (this.score >= 95) {
      log('  • Excelente! Segurança em alto nível', 'green');
    } else if (this.score >= 85) {
      log('  • Boa segurança, pequenos ajustes recomendados', 'yellow');
    } else if (this.score >= 70) {
      log('  • Segurança aceitável, melhorias necessárias', 'yellow');
    } else {
      log('  • ATENÇÃO: Problemas críticos de segurança!', 'red');
      log('  • Revisão urgente necessária', 'red');
    }
    
    log('\\n' + '='.repeat(60), 'cyan');
    
    return this.score;
  }

  async run() {
    log('🚀 Iniciando validação de segurança...\\n', 'bright');
    
    await this.validateSecrets();
    await this.validateEnvironment();
    await this.validateDependencies();
    await this.validateBuildSecurity();
    await this.validateGitSecurity();
    
    const finalScore = this.generateReport();
    
    // Exit code baseado no score
    if (finalScore < 70) {
      process.exit(1);
    } else if (finalScore < 85) {
      process.exit(0); // Warning but acceptable
    } else {
      process.exit(0); // Good
    }
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  const validator = new SecurityValidator();
  validator.run().catch(error => {
    console.error('❌ Erro na validação de segurança:', error);
    process.exit(1);
  });
}

module.exports = SecurityValidator; 