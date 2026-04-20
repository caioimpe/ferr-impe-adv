# Deploy Editorial — Ferrigato & Imperato Advogados

Guia completo de implantação do sistema editorial em produção (Vercel + Neon + Vercel Blob).

---

## Índice

1. [Visão geral da arquitetura](#1-visão-geral-da-arquitetura)
2. [Variáveis de ambiente](#2-variáveis-de-ambiente)
3. [Configurar Postgres (Neon) na Vercel](#3-configurar-postgres-neon-na-vercel)
4. [Configurar Vercel Blob](#4-configurar-vercel-blob)
5. [Instalar dependências](#5-instalar-dependências)
6. [Executar migrations](#6-executar-migrations)
7. [Rodar localmente](#7-rodar-localmente)
8. [Deploy na Vercel](#8-deploy-na-vercel)
9. [Migrar artigos existentes do storage local para o Postgres](#9-migrar-artigos-existentes)
10. [Fluxo de publicação de artigos](#10-fluxo-de-publicação)

---

## 1. Visão geral da arquitetura

```
Nuxt 3 (SSR)
│
├── Painel Admin (/admin)          — autenticação via JWT em cookie httpOnly
│   ├── CRUD de artigos            → POST/PUT/DELETE /api/admin/articles
│   └── Upload de imagens          → POST /api/admin/upload
│
├── Site público (/artigos)        — SSR + indexável pelo Google
│   ├── Listagem                   → GET /api/articles
│   ├── Artigo individual          → GET /api/articles/[slug]
│   └── Categorias                 → GET /api/articles/categories
│
└── Camada de repositório          — abstração que seleciona o banco correto
    ├── storageAdapter             ← Nitro fs (desenvolvimento local, sem DATABASE_URL)
    └── prismaAdapter              ← Postgres/Neon (produção, DATABASE_URL definida)
```

**Regra de seleção do banco:**
- `DATABASE_URL` **ausente** → usa Nitro `useStorage` (fs local, `.data/db/`)
- `DATABASE_URL` **definida** → usa Prisma com Postgres (Neon)

---

## 2. Variáveis de ambiente

### Desenvolvimento (`.env` local)

```env
# Autenticação admin
ADMIN_PASSWORD=sua_senha_forte_aqui
JWT_SECRET=string_aleatoria_minimo_32_caracteres_aqui

# Deixe em branco em dev para usar o storage local (Nitro fs)
# DATABASE_URL=
# BLOB_READ_WRITE_TOKEN=
```

### Produção (Vercel Environment Variables)

| Variável               | Fonte                         | Obrigatória |
|------------------------|-------------------------------|-------------|
| `ADMIN_PASSWORD`       | Você define                   | ✅ sim      |
| `JWT_SECRET`           | Você define (≥ 32 chars)      | ✅ sim      |
| `DATABASE_URL`         | Vercel Marketplace → Neon     | ✅ sim      |
| `BLOB_READ_WRITE_TOKEN`| Vercel Marketplace → Blob     | ✅ sim      |

> **Dica:** O `JWT_SECRET` pode ser gerado com `openssl rand -base64 48` no terminal.

---

## 3. Configurar Postgres (Neon) na Vercel

### 3.1 Criar o banco

1. Acesse o **Vercel Dashboard** → seu projeto → aba **Storage**
2. Clique em **Create Database** → selecione **Neon Postgres**
3. Escolha o plano gratuito (suficiente para começar)
4. Selecione a região mais próxima dos seus usuários (ex: `São Paulo` ou `US East`)
5. Clique em **Create** e depois **Connect to Project**

A Vercel injetará automaticamente a variável `DATABASE_URL` no seu projeto (Production + Preview environments).

### 3.2 Obter a URL local para desenvolvimento

No painel do Neon (ou Vercel Storage):
1. Clique no banco criado → aba **Connection Details**
2. Copie a **Connection String** (formato `postgres://...`)
3. Adicione ao seu `.env` local:

```env
DATABASE_URL=postgres://user:password@host/dbname?sslmode=require&pgbouncer=true&connection_limit=1
```

> Os parâmetros `pgbouncer=true&connection_limit=1` são essenciais para ambientes serverless — evitam esgotar o pool de conexões.

---

## 4. Configurar Vercel Blob

### 4.1 Criar o Blob Store

1. Vercel Dashboard → **Storage** → **Create Database** → **Blob**
2. Dê um nome (ex: `ferr-impe-images`)
3. Conecte ao projeto → **Connect to Project**

A Vercel injetará `BLOB_READ_WRITE_TOKEN` automaticamente.

### 4.2 Para desenvolvimento local com Blob (opcional)

Se quiser testar o upload com Blob localmente:
1. Vercel Dashboard → Storage → seu Blob → **Settings** → copie o token
2. Adicione ao `.env`:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxx
```

Sem esse token, o upload em desenvolvimento usa o filesystem local normalmente.

---

## 5. Instalar dependências

Execute **uma única vez** no projeto:

```bash
# ORM e client do banco
npm install prisma @prisma/client

# SDK de upload de imagens
npm install @vercel/blob
```

---

## 6. Executar migrations

### 6.1 Primeira migration (cria a tabela no banco)

Com `DATABASE_URL` configurado no `.env`:

```bash
# Gera e aplica a migration inicial
npx prisma migrate dev --name init
```

Isso vai:
- Criar a tabela `Article` no banco Neon
- Gerar o Prisma Client tipado em `node_modules/@prisma/client`

### 6.2 Aplicar migrations em produção

O comando abaixo deve rodar no CI/CD ou manualmente antes de cada deploy que altere o schema:

```bash
npx prisma migrate deploy
```

> **Sugestão:** adicione ao script de build da Vercel em **Settings → Build Command**:
> ```
> npx prisma migrate deploy && nuxt build
> ```

### 6.3 Comandos Prisma úteis

```bash
# Inspecionar o banco atual
npx prisma studio

# Regenerar o client (após mudar o schema sem migrate)
npx prisma generate

# Ver status das migrations
npx prisma migrate status
```

---

## 7. Rodar localmente

### Sem banco (modo atual — storage local)

```bash
# Apenas ADMIN_PASSWORD e JWT_SECRET no .env
npm run dev
```

Artigos são salvos em `.data/db/` (Nitro fs driver). Tudo funciona como antes.

### Com banco Postgres local (modo produção)

```bash
# DATABASE_URL configurada no .env
npx prisma migrate dev --name init   # apenas na primeira vez
npm run dev
```

O repositório detecta `DATABASE_URL` e usa o Prisma automaticamente.

---

## 8. Deploy na Vercel

### 8.1 Pré-requisitos

- [ ] Banco Neon criado e conectado ao projeto
- [ ] Vercel Blob criado e conectado ao projeto
- [ ] `ADMIN_PASSWORD` e `JWT_SECRET` configurados em **Settings → Environment Variables**
- [ ] `npx prisma generate` rodou no build (veja 6.2)

### 8.2 Configuração do Build Command na Vercel

Em **Settings → Build & Development Settings → Build Command**, use:

```
npx prisma generate && npx prisma migrate deploy && nuxt build
```

Isso garante que:
1. O Prisma Client é gerado com os tipos corretos
2. As migrations são aplicadas antes de qualquer request
3. O Nuxt é compilado com o client disponível

### 8.3 Verificação pós-deploy

Após o deploy, acesse:
- `/admin/login` → faça login
- `/admin` → crie um artigo de teste
- `/artigos` → verifique se aparece
- `/artigos/[slug]` → verifique SSR no `view-source:`

---

## 9. Migrar artigos existentes

Os artigos atuais estão em `.data/db/` (formato Nitro useStorage).

### Estratégia de migração (a executar quando pronto)

1. Criar um script de migração em `scripts/migrate-articles.ts`
2. O script lê os artigos do Nitro storage local e os insere via Prisma no Neon
3. Verificar integridade dos dados
4. Remover o driver fs do `nuxt.config.ts` (ou mantê-lo como fallback)

> **Atenção:** não execute a migração em produção sem backup dos dados do Nitro storage.
> O diretório `.data/db/` é a fonte atual de verdade — mantenha uma cópia.

---

## 10. Fluxo de publicação

Com a arquitetura pronta:

```
Autor cria artigo no painel /admin
    ↓
POST /api/admin/articles → articlesRepository.saveArticle()
    ↓ DATABASE_URL definida?
    ├── Sim → prismaAdapter → INSERT INTO "Article"
    └── Não → storageAdapter → useStorage (fs)
    ↓
Autor publica (status: 'published')
    ↓
GET /api/articles → retorna apenas publicados → SSR em /artigos
    ↓
Google indexa via sitemap / link externo
```

---

## Checklist de produção

- [ ] `npm install prisma @prisma/client @vercel/blob`
- [ ] Banco Neon criado e conectado
- [ ] `DATABASE_URL` disponível (automática via Vercel)
- [ ] Blob Store criado e conectado
- [ ] `BLOB_READ_WRITE_TOKEN` disponível (automática via Vercel)
- [ ] `ADMIN_PASSWORD` e `JWT_SECRET` configurados em Vercel
- [ ] Build Command atualizado com `prisma generate && prisma migrate deploy`
- [ ] Primeiro deploy realizado
- [ ] Login admin testado em produção
- [ ] Criação de artigo testada em produção
- [ ] Upload de imagem testado em produção
- [ ] Artigo visível em `/artigos` em produção
- [ ] `view-source:` confirma SSR (HTML renderizado, não SPA)
