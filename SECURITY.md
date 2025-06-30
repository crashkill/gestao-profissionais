# 🔒 Guia de Segurança - Talent Sphere Registry

## 🚨 Checklist de Segurança

### **Antes de Cada Commit**
```bash
# Verificar se não há tokens expostos
npm run secure:scan

# Verificar variáveis de ambiente
npm run secure:check
```

### **✅ Práticas Seguras**

1. **NUNCA** commitar chaves/tokens diretamente no código
2. **SEMPRE** usar variáveis de ambiente via Doppler
3. **VERIFICAR** .gitignore antes de adicionar novos arquivos
4. **REGENERAR** chaves imediatamente se expostas

### **🔑 Variáveis de Ambiente Obrigatórias**

| Variável | Descrição | Onde Obter |
|----------|-----------|------------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase | Dashboard > Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima | Dashboard > Settings > API |
| `VITE_GROQ_API_KEY` | Chave API Groq (opcional) | https://console.groq.com/ |
| `VITE_TOGETHER_API_KEY` | Chave Together.ai (opcional) | https://together.ai/ |

### **🛡️ Em Caso de Vazamento**

1. **IMEDIATO**: Regenerar todas as chaves comprometidas
2. **CÓDIGO**: Remover tokens hardcoded
3. **GIT**: Limpar histórico se necessário
4. **MONITORAR**: Verificar logs de acesso suspeito

### **📊 Monitoramento**

- GitGuardian: Detecta tokens expostos
- Doppler: Auditoria de acesso a segredos
- Supabase: Logs de API calls

### **🔧 Comandos Úteis**

```bash
# Escanear por tokens
npm run secure:scan

# Verificar configuração atual
doppler secrets

# Regenerar service token
doppler auth revoke

# Limpar arquivos temporários
npm run secure:clean
```

---

**⚠️ Em caso de emergência**: Regenerar TODAS as chaves e notificar a equipe! 