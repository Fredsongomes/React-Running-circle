# Runner Circle — especificação do backend (agnóstica de stack)

Contrato que o backend precisa cumprir para o front-end do curso funcionar de ponta a ponta.
Não prescreve linguagem, framework nem banco — só **o que** cada endpoint recebe e devolve, os
modelos de dados e as regras transversais. Qualquer stack (Node/Express, NestJS, Fastify, Django,
Rails, Laravel, Go, .NET…) serve, desde que respeite este contrato.

A entrega segue o mesmo formato do backend do Fokus: **fornecido pronto, subido via Docker, com
OpenAPI/Swagger navegável e seed de dados** (para o feed nunca aparecer vazio na aula 2).

> Toda a UI já existe e consome dados com estas formas. Os modelos abaixo foram derivados dos
> componentes (`PostCard`, `ProfileHeader`) e dos formulários (`NewPost`, `EditProfile`, `Login`,
> `Register`). Mantê-los é o que garante que as páginas prontas renderizem sem retrabalho.

---

## 1. Requisitos transversais

| Tema | Regra |
|------|-------|
| **Protocolo** | HTTP/JSON. Uploads em `multipart/form-data`. |
| **CORS** | Liberar a origem do front em dev (`http://localhost:5173`) e a de produção. |
| **Auth** | JWT (bearer). Endpoints protegidos exigem `Authorization: Bearer <token>`. Sem token / token inválido → `401`. |
| **Formato de erro** | JSON consistente, sempre com uma mensagem legível. Ex.: `{ "message": "Email já cadastrado" }`. O front exibe essa mensagem direto (aulas 3.1, 4.1). |
| **Validação** | `400` com mensagem clara em campos faltando/ inválidos. `409` (ou `400`) para email/usuário já existente. |
| **Datas** | ISO 8601 UTC (`createdAt`, `updatedAt`). |
| **IDs** | String estável (UUID ou similar). O contrato não depende do tipo, mas seja consistente. |
| **Paginação** | O feed (`GET /posts`) deve paginar (ver §4). Retornar lista vazia `[]` quando não há dados — nunca `404` para "coleção vazia" (o front trata estado vazio na aula 2.4). |
| **Uploads** | Aceitar imagem (`png`/`jpg`/`webp`), limitar tamanho, devolver **URL absoluta** servível pelo front. Servir os arquivos estáticos. |
| **Env** | Base URL da API entra no front via variável de ambiente (aula 2.2). O backend só precisa expor a URL base e a doc do Swagger. |
| **Seed** | Popular alguns usuários e posts (com curtidas) para o feed já vir cheio. |

### Sobre unidades (decisão recomendada)

A UI hoje usa strings já formatadas nos mocks (`"2 Km"`, `"300 Kcal"`, `"120 BPM"`, `"00:30"`).
Para um backend limpo, **armazene e devolva números crus** e deixe o front compor o texto de
exibição. A **unidade não vai no payload** — ela é decisão de contrato, fixada uma vez e embutida
no **nome do campo** (auto-documentado, sem campo `unit` extra, sem ambiguidade entre posts):

- `distanceMeters` → metros (int)
- `calories` → kcal (int) — unidade única, nome simples já basta
- `heartRateBpm` → bpm (int)
- `durationSeconds` → segundos (int)
- `type` → enum (`walking` | `running`), não texto livre

Assim a formatação vira responsabilidade do front (`distanceMeters: 2000` → `"2 Km"`), coerente com
o curso, que já domina isso. Se preferir espelhar os mocks 1:1, pode devolver strings — mas números
crus com a unidade no nome do campo são a recomendação.

**Na entrada (formulários) a simetria vale:** o `NewPost` coleta cada valor na unidade de exibição
(inputs `type="number"`, unidade fixada no label) e o front converte para o canônico **antes** de
enviar. Em especial, **distância é digitada em km** (ex. `5`) e o front multiplica por 1000 →
manda `distanceMeters: 5000`, porque o backend armazena em **metros**. Duração vem do par
horas/minutos → `durationSeconds`. Calorias (kcal) e batimentos (bpm) já são digitados na unidade
canônica. Ou seja: o backend nunca recebe km nem string de unidade — recebe/armazena/devolve
metros e a UI cuida do km↔m nos dois sentidos.

> Única exceção (fora do escopo do curso): suporte a métrico vs imperial por usuário. Aí o backend
> ainda devolve o valor **canônico** (metros) + uma preferência no perfil, e o front converte —
> nunca uma string de unidade por valor.

---

## 2. Modelos de dados

### User
Campos derivados de `ProfileHeader` (`avatarSrc`, `username`, `name`, `bio`, `workouts`) e dos
formulários de auth/edição.

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | string | |
| `name` | string | "Júlio Oliveira" |
| `username` | string | handle único, armazenado **sem `@`** (ex. `julio`). O `@` é prefixo de **exibição** — o front renderiza (`@${username}`), evitando o clássico `@@julio` no form de edição. Validar unicidade e formato no cadastro |
| `email` | string | único (validar) |
| `passwordHash` | string | **nunca** retornado pela API |
| `bio` | string | opcional; "Descrição" no form de edição |
| `avatarUrl` | string \| null | URL absoluta servível |
| `workoutsCount` | int | derivado: nº de posts do usuário (`workouts` no header) |
| `createdAt` | ISO date | |

> **Representação pública** (o que a API devolve): tudo acima **menos** `passwordHash`. Chame de
> `PublicUser`. É o que vai no `AuthContext` (aula 3.3) e no perfil (aula 5.1).

> **Ponta solta pro front (não é mudança de contrato):** o mock atual do `ProfileHeader` passa
> `username="@julio"` e renderiza cru. Como a API devolve o handle **sem `@`** (`julio`), ao plugar
> dados reais na **aula 5.1** a página precisa prepor o `@` na exibição (`@${username}`). É trabalho
> de formatação do front, esperado nessa aula — fica registrado pra não pegar de surpresa.

### Post
Campos derivados de `PostCard` (`time`, `activity`, `distance`, `calories`, `heartRate`, `author`,
`avatarSrc`, `likes`, `comments`, `description`) e do form `NewPost`.

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | string | |
| `author` | PublicUser (embutido) | preenche `author` + `avatarSrc` do card |
| `imageUrl` | string \| null | foto do treino (upload) |
| `durationSeconds` | int | "Tempo" → front exibe como `time` (`"00:30"`) |
| `type` | enum `walking`\|`running` | "Tipo de Treino" → vira o `Tag`/`activity` do card |
| `distanceMeters` | int | canônico em **metros**; input em km (front converte km↔m), exibe `"2 Km"` |
| `calories` | int | kcal |
| `heartRateBpm` | int | front exibe como `heartRate` (`"120 BPM"`) |
| `description` | string | |
| `likesCount` | int | derivado da tabela de curtidas |
| `likedByMe` | boolean | **por requisição autenticada** — habilita o toggle e a sincronização (aulas 5.3/6.4) |
| `commentsCount` | int | derivado da lista de comentários (ver §7) |
| `createdAt` | ISO date | ordenar feed desc |

### Like
Relação usuário↔post (curtida). Não precisa ser exposta como recurso próprio — basta suportar
curtir/descurtir e derivar `likesCount` + `likedByMe`.

| Campo | Tipo |
|-------|------|
| `userId` | string |
| `postId` | string |
| (par único: um usuário curte um post no máximo uma vez) | |

### Comment
Item da lista da `CommentsModal` (avatar + autor + texto). Sub-recurso de um post.

| Campo | Tipo | Observação |
|-------|------|-----------|
| `id` | string | |
| `postId` | string | post comentado |
| `author` | PublicUser (embutido) | preenche avatar + nome no item |
| `text` | string | conteúdo do comentário |
| `createdAt` | ISO date | ordena a lista |

---

## 3. Autenticação

### `POST /auth/login`  · público · aula 3.2
Login. Devolve o token JWT e o usuário.

**Request**
```json
{ "email": "julio@example.com", "password": "secret123" }
```
**200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "u1", "name": "Júlio Oliveira", "username": "julio", "email": "julio@example.com", "bio": "...", "avatarUrl": "https://.../a.png", "workoutsCount": 3, "createdAt": "..." }
}
```
**401** — credenciais inválidas → `{ "message": "Email ou senha inválidos" }`

> O token é um JWT assinado (crachá): o servidor valida a assinatura, não guarda sessão. O front
> guarda no `localStorage` (aula 3.2).

### `POST /users`  · público · aula 3.1
Cadastro. (Registro fica sob `/users` conforme o planejamento.)

**Request**
```json
{ "name": "Júlio Oliveira", "username": "julio", "email": "julio@example.com", "password": "secret123" }
```
**201** — devolve o `PublicUser` criado (o front redireciona para `/login`).
**409 / 400** — email ou username já existe → `{ "message": "Email já cadastrado" }` (o front mostra essa mensagem).

> **Logout** não tem endpoint: é client-side (limpar token + context, aula 3.5).

---

## 4. Posts

### `GET /posts`  · público (melhor se autenticado) · aula 2.3
Feed. Ordenado por `createdAt` desc. Paginado.

> **Público por design, não por descuido.** No curso o feed (aula 2) é consumido **antes** da auth
> existir (aula 3) — se `GET /posts` exigisse token, a aula 2 não rodaria. Deixe explícito para
> ninguém "corrigir" para protegido e quebrar a ordem do roteiro.

**Query params:** `page` (default 1), `limit` (default ~10); filtros opcionais `authorId` (posts de
um usuário — aba Posts do perfil) e `likedBy=me` (posts curtidos — aba Curtidas, §5).

**200**
```json
{
  "data": [
    {
      "id": "p1",
      "author": { "id": "u1", "name": "Laura Mota Linhares", "username": "laura", "avatarUrl": "https://i.pravatar.cc/96?img=68" },
      "imageUrl": "https://.../treino.png",
      "durationSeconds": 1800,
      "type": "walking",
      "distanceMeters": 2000,
      "calories": 300,
      "heartRateBpm": 120,
      "description": "Hoje dei meu mínimo e esse foi meu máximo! kkkk",
      "likesCount": 5,
      "likedByMe": false,
      "commentsCount": 0,
      "createdAt": "2026-07-20T10:00:00Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 42
}
```
> Se autenticado (header presente), preencher `likedByMe` para o usuário atual. Sem auth, `false`.

> **Envelope `{ data, page, limit, total }`.** A lista vem dentro de `data` (não na raiz). Com axios,
> a pessoa escreve `response.data.data` (o `.data` do axios + o `data` do envelope) — momento que
> merece uma fala no vídeo 2.3, não uma surpresa. Mantenha o envelope consistente em toda coleção
> paginada (feed, filtros, comentários) e deixe isso óbvio no Swagger/seed.

### `POST /posts`  · protegido · aula 4 (multipart)
Cria um post. `multipart/form-data` porque carrega a foto do treino.

**Campos (form-data):** `image` (arquivo, opcional), `durationSeconds`, `type`, `distanceMeters`,
`calories`, `heartRateBpm`, `description`. O `author` vem do token — **não** do corpo.

> `distanceMeters` chega já em **metros**: o form coleta km (`type=number`) e o front converte
> (km × 1000) antes de enviar. Idem `durationSeconds`, montado a partir do input horas/minutos.
> O backend não precisa converter nada — só validar que são inteiros ≥ 0.

**201** — devolve o `Post` criado (com `author` embutido e `imageUrl` já resolvida). O front navega
para o feed e o post novo aparece (aula 4.4 / invalidação na 6.4).
**400** — validação. **401** — sem token.

### `GET /posts/:id`  · público · opcional
Post único. Útil, não obrigatório pelo roteiro — o card do feed **não** tem mais link "Ver mais"
(removido), então não há navegação para detalhe no fluxo atual.

---

## 5. Usuários e perfil

### `GET /users/me`  · protegido · aula 5.1
Usuário logado (a partir do token). Retorna `PublicUser`. Alimenta o `AuthContext` e a página de perfil.

### `GET /posts?authorId=:id`  · aula 5.1
Posts de um usuário — reutiliza `GET /posts` com filtro. (Alternativa: `GET /users/:id/posts`.)
Preenche o grid e o `workoutsCount` do perfil. É a **aba Posts** do perfil.

### `GET /posts?likedBy=me`  · protegido · aula 5.4
Posts que o **usuário logado curtiu** — alimenta a **aba Curtidas** do perfil. Mesmo envelope
paginado do feed (§4). É só outro filtro no endpoint que o front já consome — a aba vira uma query
diferente, não um endpoint novo. (Alternativa RESTful: `GET /users/me/likes`; ficamos com o filtro
pela reutilização.)

### `PUT /users/me`  · protegido · aula 5.2 (multipart)
Edita o perfil do usuário logado. `multipart/form-data` por causa do **avatar**.

**Campos (form-data):** `avatar` (arquivo, opcional), `username`, `name`, `bio`.
**200** — devolve o `PublicUser` atualizado (com `avatarUrl` nova).
**409/400** — username já em uso / validação. **401** — sem token.

### `GET /users/:username`  · público · opcional
Perfil de outra pessoa. O roteiro só cobre o perfil do usuário logado, mas o modelo suporta.

---

## 6. Curtidas

### `POST /posts/:id/likes`  · protegido · aulas 5.3 / 6.4
Curte o post. Idempotente (curtir de novo não duplica).

**200/201**
```json
{ "postId": "p1", "likesCount": 6, "likedByMe": true }
```

### `DELETE /posts/:id/likes`  · protegido · aulas 5.3 / 6.4
Descurte.

**200**
```json
{ "postId": "p1", "likesCount": 5, "likedByMe": false }
```

> **Devolver `likesCount` + `likedByMe` autoritativos é essencial.** É o que resolve o problema
> plantado na aula 5.3 ("e se dois lugares mostram o mesmo post?") e materializa a invalidação do
> React Query na 6.4: depois de curtir, o front invalida o feed/perfil e a contagem sincroniza em
> todo lugar a partir da fonte da verdade.

---

## 7. Comentários

Alimentam a `CommentsModal` (lista + campo de escrever). Sub-recurso do post, simétrico às curtidas.

### `GET /posts/:id/comments`  · público
Lista os comentários do post (para a modal). Ordenar por `createdAt`. Pode paginar como o feed (§4)
ou devolver a lista simples se o volume for pequeno.

**200**
```json
{
  "data": [
    {
      "id": "c1",
      "postId": "p1",
      "author": { "id": "u2", "name": "Júlia Santos", "username": "julia", "avatarUrl": "https://i.pravatar.cc/96?img=45" },
      "text": "Arrasou! 👏",
      "createdAt": "2026-07-20T11:00:00Z"
    }
  ],
  "total": 4
}
```

### `POST /posts/:id/comments`  · protegido
Cria um comentário no post. O `author` vem do token — **não** do corpo.

**Request**
```json
{ "text": "Bora treinar junto semana que vem?" }
```
**201** — devolve o `Comment` criado (com `author` embutido). O front injeta na lista e o
`commentsCount` do card sobe (mesma invalidação das curtidas na 6.4).
**400** — texto vazio/inválido. **401** — sem token.

> `commentsCount` no `Post` é derivado desta coleção — a API é a fonte da verdade da contagem, igual
> às curtidas.

---

## 8. Uploads

Duas abordagens — escolha uma e documente no Swagger:

1. **Embutido nos recursos (recomendado, é o que o roteiro assume):** `image` em `POST /posts` e
   `avatar` em `PUT /users/me`, ambos `multipart/form-data`. O backend salva e devolve a `imageUrl`/
   `avatarUrl` já no objeto de resposta. É o que as aulas 4.2 e 5.2 mostram (o `FormData` carrega
   arquivo + campos juntos).
2. **Endpoint dedicado (alternativa):** `POST /uploads` → `{ "url": "https://..." }`, e o front manda
   a URL nos JSONs de post/perfil.

**Regras:** validar tipo (`image/png`, `image/jpeg`, `image/webp`), limitar tamanho (ex. 5 MB),
servir os arquivos por URL absoluta acessível pelo front.

---

## 9. Mapa aula → backend

| Aula / vídeo | O que exige do backend |
|--------------|------------------------|
| 2.1 Swagger | OpenAPI navegável + docker up + seed |
| 2.3 Feed (fetch) | `GET /posts` com `author` embutido e contagens |
| 2.4 Loading/erro/vazio | status codes corretos, `[]` para vazio |
| 3.1 Cadastro | `POST /users` + erro "email já existe" |
| 3.2 Login/JWT | `POST /auth/login` → `{ token, user }` |
| 3.4 Rotas protegidas | `401` sem token nos endpoints protegidos |
| 3.5 Header/Logout | aceitar `Authorization: Bearer` (logout é client-side) |
| 4.1–4.4 Nova postagem | `POST /posts` multipart (foto + campos) |
| 5.1 Perfil | `GET /users/me` + `GET /posts?authorId=` |
| 5.2 Editar perfil | `PUT /users/me` multipart (avatar) |
| 5.3 Curtidas | `POST`/`DELETE /posts/:id/likes` devolvendo `likesCount`+`likedByMe` |
| 5.4 Aba de curtidas | `GET /posts?likedBy=me` (mesmo envelope paginado) |
| 5.5–5.6 Comentários (modal) | `GET`/`POST /posts/:id/comments` (lista + criar) |
| 6.x React Query | contrato estável de curtida/feed que permite invalidação |
| 7.1 Deploy | API pública + base URL via env |

---

## 10. Fora de escopo (mas o modelo prevê)

Presentes na UI ou no domínio, mas **não** implementados pelo roteiro do curso — deixe como
opcional/stub para não quebrar o layout:

- **Seguir / conexões:** removidos da UI — o `ProfileHeader` não tem mais botão "Seguir" nem
  contagem de conexões (o header mostra só `workoutsCount`). Por isso `connectionsCount` **saiu do
  contrato**. Se um dia houver follow, a contagem + `POST /users/:id/follow` voltam como extensão
  opcional.
- **Refresh token / expiração longa:** o curso usa um JWT simples no `localStorage` "com tradeoffs,
  como ponto de partida" (aula 3.2). Refresh token é opcional.
- **Busca:** o Feed tem um `SearchInput`, mas busca não é ensinada. Um param `?q=` é opcional.

---

## 11. Checklist de prontidão

- [ ] Docker sobe a API + banco com um comando
- [ ] Swagger/OpenAPI navegável e testável
- [ ] Seed: usuários + posts com curtidas (feed não vem vazio)
- [ ] CORS liberado para `localhost:5173` e produção
- [ ] JWT: login emite, endpoints protegidos exigem, `401` correto
- [ ] `GET /posts` paginado, com `author` embutido, `likesCount` e `likedByMe`
- [ ] `POST /posts` e `PUT /users/me` aceitam `multipart/form-data` e devolvem URLs absolutas
- [ ] Curtir/descurtir devolvem contagem autoritativa
- [ ] `GET /posts?likedBy=me` (aba Curtidas) e `?authorId=` (aba Posts) filtram o feed
- [ ] `GET`/`POST /posts/:id/comments` (listar + criar) para a modal de comentários
- [ ] Mensagens de erro legíveis em JSON (`{ "message": ... }`)
- [ ] Arquivos de upload servidos por URL pública
