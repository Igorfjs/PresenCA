# PresenCA

Sistema de gestão de presença da comunidade Cristo Alegria. O repositório está organizado como monorepo com aplicações separadas para a interface e a futura API.

## Stack

- **Web:** Next.js App Router, React, TypeScript, Tailwind CSS, Framer Motion, Recharts e Lucide.
- **API:** NestJS, TypeScript, REST e validação de entrada.
- **Persistência:** PostgreSQL e Prisma ORM.
- **Ambientes:** Docker Compose para desenvolvimento local; configuração separada para produção.

O painel web ainda usa dados mockados. A API contém o bootstrap, health check, módulos de domínio e schema inicial do banco; autenticação, autorização e operações de negócio ainda serão implementadas.

## Pastas

```text
apps/
  web/
    src/
      app/                 # rotas Next.js
      features/            # telas e fluxos por aba/domínio
        dashboard/
        events/
        members/
        participants/
        organizers/
        reports/
        settings/
        profile/
        qr-code/
        shared/
        shell/
      components/          # componentes visuais compartilhados
      hooks/
      lib/
      mocks/
      services/            # serviços mockados e fronteira de integração
      types/
  api/
    src/modules/           # módulos NestJS por domínio
    prisma/                # schema e futuras migrações
documentation/             # PRD e regras de negócio
compose.yaml               # ambiente local de desenvolvimento
compose.production.yaml    # implantação em produção, sem banco local
```

## Pré-requisitos

- Node.js 22 ou compatível com as dependências dos aplicativos.
- Docker Desktop com Docker Compose.
- npm.

## Desenvolvimento local com Docker

Na primeira execução, crie os arquivos locais de ambiente a partir dos exemplos:

```powershell
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
docker compose up --build
```

A interface fica em `http://localhost:3001` por padrão, a API em `http://localhost:4000/api/v1` e o health check em `http://localhost:4000/api/v1/health`. A porta pública da interface pode ser alterada por `WEB_PORT` no `.env`. O PostgreSQL local usa a porta `5432` e grava somente no volume `postgres_development_data`.

Para criar a primeira migração no banco de desenvolvimento:

```powershell
docker compose exec api npm run prisma:migrate:dev -- --name init
```

Para parar o ambiente, use `docker compose down`. Os dados locais permanecem no volume de desenvolvimento. Para apagar somente esse banco de desenvolvimento e recriá-lo, use `docker compose down -v`.

### Executar sem Docker

```powershell
cd apps/web
npm install
npm run dev
```

Em outro terminal, instale e inicie a API:

```powershell
cd apps/api
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run start:dev
```

Nesse modo, configure `DATABASE_URL` em `apps/api/.env` para apontar ao PostgreSQL local ou remoto de desenvolvimento.

## Produção

A configuração de produção é independente do Compose local. Ela não monta os arquivos-fonte, não usa o volume de desenvolvimento e **não cria um banco PostgreSQL local**. Configure o PostgreSQL de produção em um serviço próprio/gerenciado e use uma URL de conexão diferente da usada no desenvolvimento.

Crie os arquivos privados usando os exemplos:

```powershell
Copy-Item .env.production.example .env.production
Copy-Item apps/api/.env.production.example apps/api/.env.production
Copy-Item apps/web/.env.production.example apps/web/.env.production
```

Preencha as URLs, credenciais e segredo de sessão reais nos arquivos ignorados pelo Git. Depois, gere as imagens de produção:

```powershell
docker compose --env-file .env.production -f compose.production.yaml build
```

Antes de iniciar a API, aplique as migrações contra o banco de produção usando o processo de release/deploy da infraestrutura:

```powershell
docker compose --env-file .env.production -f compose.production.yaml run --rm api npx prisma migrate deploy
docker compose --env-file .env.production -f compose.production.yaml up -d
```

Não use credenciais ou dados reais de produção no `.env` local nem no `compose.yaml` de desenvolvimento.

## Variáveis de ambiente

- `apps/web/.env.example`: URL pública da API. Variáveis `NEXT_PUBLIC_*` são incluídas no bundle do navegador e não podem conter segredos.
- `apps/api/.env.example`: ambiente, porta, origem web, URL PostgreSQL e segredo de sessão para desenvolvimento.
- Arquivos `.env.production`: configurações privadas de produção, ignoradas pelo Git.

O Compose local oferece credenciais exclusivas para o container de desenvolvimento. Em produção, a API exige uma URL de banco própria e um segredo de sessão forte.

## Documentação do produto

- [PRD](documentation/01_PRD.md)
- [Regras de negócio](documentation/02_Regras_de_Negocio.md)
- [Documentação existente](documentation/DOCUMENTACAO.md)
