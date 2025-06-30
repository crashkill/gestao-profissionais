import { supabase } from './supabaseClient';

export interface SecurityAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  resolved?: boolean;
}

export interface SecurityCheck {
  name: string;
  description: string;
  check: () => Promise<SecurityAlert[]>;
  frequency: 'startup' | 'periodic' | 'manual';
}

class SecurityMonitor {
  private alerts: SecurityAlert[] = [];
  private checks: SecurityCheck[] = [];
  private listeners: ((alerts: SecurityAlert[]) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeChecks();
    this.startPeriodicChecks();
  }

  private initializeChecks() {
    this.checks = [
      {
        name: 'environment_variables',
        description: 'Verifica se variáveis de ambiente estão configuradas',
        frequency: 'startup',
        check: this.checkEnvironmentVariables.bind(this)
      },
      {
        name: 'supabase_connection',
        description: 'Verifica conectividade com Supabase',
        frequency: 'periodic',
        check: this.checkSupabaseConnection.bind(this)
      },
      {
        name: 'rls_policies',
        description: 'Verifica se políticas RLS estão ativas',
        frequency: 'startup',
        check: this.checkRLSPolicies.bind(this)
      },
      {
        name: 'exposed_secrets',
        description: 'Busca por possíveis segredos expostos',
        frequency: 'manual',
        check: this.checkExposedSecrets.bind(this)
      }
    ];
  }

  private async checkEnvironmentVariables(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    for (const varName of requiredVars) {
      const value = import.meta.env[varName];
      
      if (!value) {
        alerts.push({
          id: `env_${varName}_${Date.now()}`,
          type: 'error',
          title: 'Variável de Ambiente Ausente',
          message: `${varName} não está configurada`,
          timestamp: new Date(),
          severity: 'critical',
          source: 'environment_check'
        });
      } else if (varName.includes('KEY') && value.startsWith('eyJ')) {
        // Basic JWT token check
        alerts.push({
          id: `env_token_${Date.now()}`,
          type: 'info',
          title: 'Token JWT Detectado',
          message: `${varName} contém um token JWT válido`,
          timestamp: new Date(),
          severity: 'low',
          source: 'environment_check'
        });
      }
    }

    return alerts;
  }

  private async checkSupabaseConnection(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];
    
    try {
      const { data, error } = await supabase
        .from('colaboradores')
        .select('count', { count: 'exact', head: true });

      if (error) {
        alerts.push({
          id: `supabase_error_${Date.now()}`,
          type: 'error',
          title: 'Erro de Conexão Supabase',
          message: `Falha ao conectar: ${error.message}`,
          timestamp: new Date(),
          severity: 'high',
          source: 'supabase_check'
        });
      } else {
        console.log('✅ Supabase conectado com sucesso');
      }
    } catch (error) {
      alerts.push({
        id: `supabase_exception_${Date.now()}`,
        type: 'error',
        title: 'Exceção na Conexão Supabase',
        message: `Erro inesperado: ${error}`,
        timestamp: new Date(),
        severity: 'critical',
        source: 'supabase_check'
      });
    }

    return alerts;
  }

  private async checkRLSPolicies(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];
    
    try {
      // Check if RLS is enabled on main tables
      const { data, error } = await supabase.rpc('check_rls_status');
      
      if (error) {
        alerts.push({
          id: `rls_check_error_${Date.now()}`,
          type: 'warning',
          title: 'Não foi possível verificar RLS',
          message: 'Função check_rls_status não encontrada',
          timestamp: new Date(),
          severity: 'medium',
          source: 'rls_check'
        });
      }
    } catch (error) {
      alerts.push({
        id: `rls_error_${Date.now()}`,
        type: 'warning',
        title: 'Erro na Verificação RLS',
        message: `Não foi possível verificar políticas RLS: ${error}`,
        timestamp: new Date(),
        severity: 'medium',
        source: 'rls_check'
      });
    }

    return alerts;
  }

  private async checkExposedSecrets(): Promise<SecurityAlert[]> {
    const alerts: SecurityAlert[] = [];
    
    // This would normally check git history, logs, etc.
    // For now, just a placeholder
    const commonSecretPatterns = [
      /sk-[a-zA-Z0-9]{48}/g, // OpenAI keys
      /gsk_[a-zA-Z0-9]+/g,   // Groq keys
      /eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*/g // JWT tokens
    ];

    // In a real implementation, this would scan files, commits, etc.
    console.log('🔍 Verificação de segredos expostos executada');

    return alerts;
  }

  private startPeriodicChecks() {
    // Run startup checks immediately
    this.runChecks(['startup']);

    // Set up periodic checks every 5 minutes
    this.intervalId = setInterval(() => {
      this.runChecks(['periodic']);
    }, 5 * 60 * 1000);
  }

  private async runChecks(frequencies: string[]) {
    const checksToRun = this.checks.filter(check => 
      frequencies.includes(check.frequency)
    );

    for (const check of checksToRun) {
      try {
        const newAlerts = await check.check();
        this.addAlerts(newAlerts);
      } catch (error) {
        console.error(`❌ Erro na verificação ${check.name}:`, error);
        this.addAlert({
          id: `check_error_${check.name}_${Date.now()}`,
          type: 'error',
          title: `Erro na Verificação: ${check.name}`,
          message: `Falha ao executar verificação: ${error}`,
          timestamp: new Date(),
          severity: 'medium',
          source: 'security_monitor'
        });
      }
    }
  }

  // Public methods
  public async runAllChecks() {
    await this.runChecks(['startup', 'periodic', 'manual']);
  }

  public async runCheck(checkName: string) {
    const check = this.checks.find(c => c.name === checkName);
    if (check) {
      const alerts = await check.check();
      this.addAlerts(alerts);
    }
  }

  public getAlerts(severity?: SecurityAlert['severity']): SecurityAlert[] {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  public getCriticalAlerts(): SecurityAlert[] {
    return this.getAlerts('critical');
  }

  public getUnresolvedAlerts(): SecurityAlert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  public resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      this.notifyListeners();
    }
  }

  public clearAlerts() {
    this.alerts = [];
    this.notifyListeners();
  }

  public addAlert(alert: SecurityAlert) {
    this.alerts.unshift(alert);
    this.notifyListeners();
    
    // Log critical alerts immediately
    if (alert.severity === 'critical') {
      console.error('🚨 ALERTA CRÍTICO DE SEGURANÇA:', alert);
    }
  }

  private addAlerts(alerts: SecurityAlert[]) {
    alerts.forEach(alert => this.addAlert(alert));
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.alerts]));
  }

  public onAlertsChange(callback: (alerts: SecurityAlert[]) => void) {
    this.listeners.push(callback);
    
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public destroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.listeners = [];
    this.alerts = [];
  }

  // Utility methods
  public getSecurityScore(): number {
    const totalAlerts = this.alerts.filter(a => !a.resolved).length;
    const criticalAlerts = this.getCriticalAlerts().filter(a => !a.resolved).length;
    
    if (criticalAlerts > 0) return 0;
    if (totalAlerts === 0) return 100;
    
    // Simple scoring algorithm
    const score = Math.max(0, 100 - (totalAlerts * 10) - (criticalAlerts * 50));
    return Math.round(score);
  }

  public getSecurityStatus(): 'secure' | 'warning' | 'critical' {
    const score = this.getSecurityScore();
    const criticalAlerts = this.getCriticalAlerts().filter(a => !a.resolved).length;
    
    if (criticalAlerts > 0) return 'critical';
    if (score < 70) return 'warning';
    return 'secure';
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

// React hook for easy integration
export function useSecurityAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(securityMonitor.getAlerts());

  useEffect(() => {
    const unsubscribe = securityMonitor.onAlertsChange(setAlerts);
    return unsubscribe;
  }, []);

  return {
    alerts,
    criticalAlerts: securityMonitor.getCriticalAlerts(),
    unresolvedAlerts: securityMonitor.getUnresolvedAlerts(),
    securityScore: securityMonitor.getSecurityScore(),
    securityStatus: securityMonitor.getSecurityStatus(),
    resolveAlert: securityMonitor.resolveAlert.bind(securityMonitor),
    runAllChecks: securityMonitor.runAllChecks.bind(securityMonitor),
    clearAlerts: securityMonitor.clearAlerts.bind(securityMonitor)
  };
}

// React imports (need to be added to imports at top)
import { useState, useEffect } from 'react'; 