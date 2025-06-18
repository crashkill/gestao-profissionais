# 🛡️ Gerenciamento de Segredos com **Doppler**

Este projeto utiliza o [Doppler](https://doppler.com/) para centralizar e versionar variáveis de ambiente de forma segura em **desenvolvimento**, **CI/CD** e **produção**.

> Doppler fornece um "**Secrets Manager as a Service**", integrando-se facilmente com GitHub Actions, Vercel, Netlify, Docker, Kubernetes, etc.

---

## 📋 Pré-requisitos

1. Conta gratuita no Doppler
2. Doppler CLI instalada

```bash
# macOS (Homebrew)
brew install dopplerhq/cli/doppler

# Windows (Scoop)
scoop install doppler

# Linux (Shell script)
curl -Ls https://cli.doppler.com/install.sh | sh
```

Verifique:

```bash
doppler --version
```

---

## 🔑 Criando Projeto & Ambiente

1. Acesse o dashboard do Doppler
2. Clique em **New Project** → Nomeie como `talent-sphere-registry`
3. Dentro do projeto, crie um **Environment** chamado `dev` (ou `prod`, conforme necessidade)
4. Adicione as variáveis:

| Chave | Descrição |
|-------|-----------|
| `VITE_SUPABASE_URL` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave Anônima Supabase |
| `VITE_GROQ_API_KEY` | (Opcional) Chave da API Groq |
| `VITE_TOGETHER_API_KEY` | (Opcional) Chave da API Together.xyz |

> Adicione *qualquer* outro segredo necessário para features futuras.

---

## ⚙️ Uso Local

Conecte o diretório do repositório ao Doppler:

```bash
doppler setup --project talent-sphere-registry --config dev
```

Execute a aplicação **injetando os segredos automaticamente**:

```bash
# Em vez de "npm run dev":
doppler run -- npm run dev
```

---

## 🚀 Integração com GitHub Actions

1. Gere um token de service do Doppler: **Project** → **Access Service Tokens** → `Generate Token` (Scope: `read`)  
2. No repositório GitHub → **Settings** → **Secrets and variables → Actions** → `New repository secret`  
   • **Name:** `DOPPLER_TOKEN`  
   • **Value:** _token gerado_
3. No workflow, adicione **antes** do passo `npm run build`:

```yaml
- name: Setup Doppler Secrets
  uses: dopplerhq/cli-action@v2
  with:
    doppler-version: 'latest'

- name: Export Secrets
  run: doppler secrets download --no-file --format env >> $GITHUB_ENV
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

Dessa forma todas as variáveis ficarão disponíveis para os passos subsequentes.

---

## 🏗️ Deploy em Produção

Caso utilize Vercel, Netlify ou outra plataforma compatível, basta conectar o projeto Doppler através das **integrations** do dashboard. Todas as variáveis serão sincronizadas automaticamente.

---

## 🛠️ Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `doppler login` | Autenticar a CLI |
| `doppler setup` | Vincular pasta atual a um projeto/ambiente |
| `doppler run -- <comando>` | Executar comando com variáveis injetadas |
| `doppler secrets download --no-file --format env` | Exportar vars para CI |
| `doppler open` | Abrir o projeto no navegador |

---

## ❓ FAQ

**Posso manter o `.env`?**  
Sim, mas o ideal é usar o Doppler para evitar vazamento de segredos no repositório.

**Preciso instalar algo em produção?**  
Não. Nas plataformas de deploy, use a integração nativa ou o token do Doppler.

---

> Para dúvidas, consulte a [documentação oficial](https://docs.doppler.com/docs). 