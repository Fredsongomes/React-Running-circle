# 🏃 Runner Circle — API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-22-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js 22" />
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS 11" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL 16" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  <br />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Passport-34E27A?style=for-the-badge&logo=passport&logoColor=white" alt="Passport" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" alt="Jest" />
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black" alt="Prettier" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="Licença MIT" />
</p>

API REST do **Runner Circle**, uma rede social de treinos de corrida e caminhada. Ela cuida de autenticação, feed, publicações com foto, curtidas, comentários e perfis, e é consumida pelo [front-end em React](../README.md).

Sobe com **um comando** via Docker, tem **documentação Swagger navegável** e já vem com **dados de exemplo** no banco.

<p align="center">
  <img src="docs/Desktop%20_%20Vis%C3%A3o%20Geral%20Feed.png" width="80%" alt="Feed do Runner Circle" />
</p>

---

## ✨ Funcionalidades

- **Autenticação JWT**: cadastro, login e rotas protegidas (e rotas com autenticação *opcional*)
- **Feed paginado**, do mais novo para o mais antigo, com autor embutido e contagem de curtidas e comentários
- **Publicação de treino** com upload de foto (`multipart/form-data`)
- **Perfil** do usuário logado com filtros de *meus posts* e *posts que curti*, e edição com troca de avatar
- **Curtidas idempotentes** que devolvem a contagem atualizada
- **Comentários** por post: listar, criar e excluir (apenas o autor)
- **Swagger / OpenAPI** em `/docs`
- **Seed** com usuários, posts, curtidas e comentários

---

## 🧱 Stack e arquitetura

| Camada | Tecnologia |
| --- | --- |
| Runtime | Node.js 22 |
| Framework | [NestJS 11](https://nestjs.com/) (Express) |
| Banco | PostgreSQL 16 |
| ORM | [TypeORM](https://typeorm.io/): entities, **migrations** e **seed** |
| Auth | JWT (`@nestjs/jwt` + Passport) + `bcryptjs` |
| Validação | `class-validator` / `class-transformer` |
| Uploads | Multer (memória) + `sharp` (conversão para WebP) |
| Docs | `@nestjs/swagger` |
| Infra | Docker + Docker Compose |

**Arquitetura modular**, com um módulo por domínio (`auth`, `users`, `posts`, `comments`, `uploads`), além de `config` (TypeORM compartilhado entre o runtime e o CLI de migrations) e `common` (filtro global de erros e paginação).

### Decisões de design

- **Números crus, unidade no nome do campo.** A API guarda e devolve `distanceMeters`, `durationSeconds`, `calories` (kcal) e `heartRateBpm` como inteiros, **sem string de unidade**. Quem formata para exibição é o cliente.
- **Contagens derivadas, não colunas.** `likesCount`, `commentsCount` e `workoutsCount` saem de `COUNT` agrupado em uma única query por página, e o banco é a fonte da verdade. Isso evita inconsistência entre contador e dados.
- **`likedByMe` por requisição.** O feed marca o que o usuário atual curtiu; para um usuário anônimo, o valor é `false`.
- **Filtro de curtidas por subquery** (`post.id IN (SELECT ...)`) em vez de `JOIN`, o que mantém uma linha por post e deixa a paginação idêntica à do feed sem filtro.
- **`username` sem `@`.** O handle é salvo limpo (`julio`), e o `@` é só decoração de exibição.
- **Erros sempre em `{ "message": "..." }`.** Um filtro global normaliza exceções HTTP, erros de validação e erros inesperados. Os inesperados são logados no servidor e chegam ao cliente como mensagem genérica.
- **Uploads convertidos para WebP.** Toda imagem (png/jpg/webp, até 15 MB, configurável) é redimensionada para no máximo 1600px, comprimida e gravada como `.webp`. O banco guarda só o nome do arquivo, e a URL absoluta é montada na resposta a partir de `API_BASE_URL`, então a troca de domínio não exige migração de dados.
- **Hash de senha nunca sai do banco por acidente**: a coluna é `select: false` e só é carregada explicitamente no login.

---

## 🚀 Como rodar

### Opção 1: Docker (recomendado)

```bash
docker compose up --build
```

Esse comando sobe o Postgres, aplica as migrations, roda o seed e inicia a API:

- API: <http://localhost:3000>
- Swagger: <http://localhost:3000/docs>

Para parar mantendo os dados, use `docker compose down`. Para zerar o banco também, use `docker compose down -v`.

### Opção 2: local

Pré-requisitos: Node 22+ e um PostgreSQL acessível.

```bash
npm install
cp .env.example .env       # ajuste DATABASE_URL se precisar
npm run migration:run
npm run seed
npm run start:dev
```

### Variáveis de ambiente

Veja [`.env.example`](./.env.example).

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `PORT` | Porta HTTP | `3000` |
| `DATABASE_URL` | Conexão com o Postgres | `postgres://runner:runner@localhost:5432/runner_circle` |
| `JWT_SECRET` | Segredo de assinatura do JWT | *(defina um valor forte em produção)* |
| `JWT_EXPIRES_IN` | Validade do token | `7d` |
| `API_BASE_URL` | URL pública da API (usada nas URLs de upload) | `http://localhost:3000` |
| `CORS_ORIGINS` | Origens de produção liberadas, separadas por vírgula | `https://meuapp.com` |
| `UPLOAD_MAX_MB` | Tamanho máximo de imagem | `15` |
| `DB_LOGGING` | Log de SQL do TypeORM | `false` |

> **CORS:** qualquer porta de `localhost`/`127.0.0.1` é liberada automaticamente em desenvolvimento. `CORS_ORIGINS` serve só para domínios de produção.

---

## 🌱 Dados de exemplo

O seed cria 5 usuários (senha **`secret123`** para todos), posts variados, curtidas e comentários. O usuário `julio` já tem posts próprios e curtidas em posts de outras pessoas, então as duas abas do perfil aparecem preenchidas.

| Login | Senha |
| --- | --- |
| `julio@example.com` | `secret123` |
| `laura@example.com` | `secret123` |
| `julia@example.com` | `secret123` |
| `pedro@example.com` | `secret123` |
| `marina@example.com` | `secret123` |

O seed é **idempotente**: se já houver usuários no banco, ele não faz nada.

---

## 📚 Endpoints

A documentação completa e testável está no **Swagger** (`/docs`). Resumo:

| Método | Rota | Auth | Descrição |
| --- | --- | --- | --- |
| `GET` | `/` | público | Healthcheck |
| `POST` | `/auth/login` | público | Login, devolve `{ token, user }` |
| `POST` | `/users` | público | Cadastro |
| `GET` | `/users/me` | 🔒 | Usuário logado |
| `PUT` | `/users/me` | 🔒 | Edita o perfil (multipart, avatar opcional) |
| `GET` | `/users/:username` | público | Perfil público |
| `GET` | `/posts` | opcional | Feed paginado: `?page&limit&authorId&likedBy=me&createdBy=me` |
| `POST` | `/posts` | 🔒 | Cria um post (multipart, foto opcional) |
| `GET` | `/posts/:id` | opcional | Post único |
| `POST` | `/posts/:id/likes` | 🔒 | Curte (idempotente) |
| `DELETE` | `/posts/:id/likes` | 🔒 | Remove a curtida |
| `GET` | `/posts/:id/comments` | público | Lista os comentários (paginado) |
| `POST` | `/posts/:id/comments` | 🔒 | Comenta |
| `DELETE` | `/posts/:id/comments/:commentId` | 🔒 | Exclui o comentário (só o autor) |

> **Feed:** `GET /posts` é público. O filtro `?likedBy=me` exige token (sem ele, a resposta é `401`). Já `?createdBy=me` é tolerante: com token, filtra pelo autor logado; sem token, o filtro é ignorado.

### Cadastro e login com campo único

```jsonc
// POST /users
{ "name": "Júlio Oliveira", "login": "julio@example.com", "password": "secret123" }
// "login" é um email  → o email é salvo e um @username único é gerado a partir dele
// "login" é um handle → vira o @username, e o email fica null
// Conflito            → 409 { "message": "Esse usuário já existe" }

// POST /auth/login
{ "login": "julio@example.com", "password": "secret123" }
// "login" pode ser o email OU o username
```

Toda coleção paginada usa o mesmo envelope:

```json
{ "data": [], "page": 1, "limit": 10, "total": 42 }
```

### Modelos

- **User**: `id, name, username, email (nullable), bio, avatarUrl, workoutsCount, createdAt`. O hash da senha nunca é exposto.
- **Post**: `id, author, imageUrl, durationSeconds, type (walking | running), distanceMeters, calories, heartRateBpm, description, likesCount, likedByMe, commentsCount, createdAt`
- **Comment**: `id, postId, author, text, createdAt`
- **Like**: relação usuário ↔ post (par único no banco)

---

## 🛠️ Scripts

```bash
npm run start:dev            # API em modo watch
npm run build                # compila para dist/
npm run lint                 # ESLint + Prettier (com --fix)
npm run migration:run        # aplica as migrations
npm run migration:revert     # desfaz a última migration
npm run migration:generate -- src/migrations/NomeDaMigration
npm run seed                 # popula o banco
npm run test:e2e             # testes e2e (requer banco rodando)
```

---

## 📄 Licença

[MIT](./LICENSE)
