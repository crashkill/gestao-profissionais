# Guia de Deploy - Gestão Profissional

Este documento descreve o processo de deploy da aplicação Gestão Profissional, incluindo os ambientes de homologação e produção.

## Estrutura de Ambientes

### Homologação
- URL: https://gestao-profissional-homologacao.vercel.app
- Supabase: https://zbiivgtdamejiwcabmcv.supabase.co
- Branch: homolog

### Produção
- URL: https://gestao-profissional.vercel.app
- Supabase: https://pwksgdjjkryqryqrvyja.supabase.co
- Branch: main

## Processo de Deploy

### 1. Preparação

Antes de iniciar o deploy, certifique-se de que:
- Todas as alterações foram testadas localmente
- Os testes automatizados estão passando
- O código foi revisado
- As variáveis de ambiente estão configuradas no Doppler

### 2. Deploy para Homologação

1. Crie uma branch a partir da main:
```bash
git checkout -b feature/nova-funcionalidade
```

2. Desenvolva e teste localmente:
```bash
npm run dev
```

3. Faça commit das alterações:
```bash
git add .
git commit -m "feat: descrição da funcionalidade"
```

4. Push para o repositório:
```bash
git push origin feature/nova-funcionalidade
```

5. Crie um Pull Request para a branch homolog

6. Após aprovação, o GitHub Actions irá:
   - Executar os testes de segurança
   - Fazer deploy para o ambiente de homologação
   - Atualizar o banco de dados de homologação
   - Notificar sobre o status do deploy

### 3. Deploy para Produção

1. Após validação em homologação, crie um Pull Request de homolog para main

2. O processo de review deve incluir:
   - Revisão do código
   - Verificação dos testes
   - Validação das funcionalidades em homologação
   - Verificação das migrações do banco de dados

3. Após aprovação, o GitHub Actions irá:
   - Executar os testes de segurança
   - Fazer deploy para o ambiente de produção
   - Atualizar o banco de dados de produção
   - Notificar sobre o status do deploy

## Configuração de Ambientes

### Doppler

1. Configure os projetos no Doppler:
   - gestao-profissional/development
   - gestao-profissional/homologacao
   - gestao-profissional/production

2. Adicione as variáveis de ambiente necessárias em cada ambiente

### Supabase

1. Configure os projetos no Supabase:
   - Homologação: zbiivgtdamejiwcabmcv
   - Produção: pwksgdjjkryqryqrvyja

2. Configure as políticas de segurança em cada projeto

### GitHub Actions

1. Configure os secrets necessários no repositório:
   - DOPPLER_TOKEN
   - SUPABASE_PROJECT_ID_HOMOLOG
   - SUPABASE_PROJECT_ID_PROD
   - VERCEL_TOKEN
   - VERCEL_ORG_ID
   - VERCEL_PROJECT_ID

## Monitoramento e Logs

### Logs do Supabase
- Acesse o dashboard do Supabase para cada ambiente
- Verifique os logs de API, banco de dados e funções
- Configure alertas para erros críticos

### Logs da Aplicação
- Configure o Sentry para monitoramento de erros
- Verifique os logs no Vercel
- Monitore métricas de performance

## Troubleshooting

### Problemas Comuns

1. **Erro no Deploy**
   - Verifique os logs do GitHub Actions
   - Confirme se todas as variáveis de ambiente estão configuradas
   - Verifique se o Doppler está configurado corretamente

2. **Erro nas Migrações**
   - Verifique os logs do Supabase
   - Confirme se as migrações estão na ordem correta
   - Faça backup do banco antes de executar migrações críticas

3. **Problemas de Performance**
   - Monitore o uso de recursos no Supabase
   - Verifique os logs de performance no Vercel
   - Analise métricas de banco de dados

## Contatos e Suporte

Para problemas ou dúvidas:
1. Abra uma issue no repositório
2. Contate a equipe de desenvolvimento
3. Em casos críticos, acione o suporte do Supabase ou Vercel

## Checklist de Deploy

### Pre-deploy
- [ ] Código revisado e aprovado
- [ ] Testes automatizados passando
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações de banco testadas
- [ ] Documentação atualizada

### Post-deploy
- [ ] Verificar status da aplicação
- [ ] Confirmar migrações do banco
- [ ] Testar funcionalidades críticas
- [ ] Monitorar logs e métricas
- [ ] Notificar equipe sobre o deploy 