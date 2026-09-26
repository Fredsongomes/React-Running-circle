# 🏃 Runner Circle

<p align="center">
  <img src="https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/CSS_Modules-000000?style=for-the-badge&logo=cssmodules&logoColor=white" alt="CSS Modules" />
  <br />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/Testing_Library-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white" alt="Testing Library" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <br />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

**Rede social para quem corre e caminha**: publique seus treinos com foto, tempo, distância, calorias e batimentos. Depois é só curtir, comentar e acompanhar a evolução no seu perfil.

Aplicação full stack com **React 19 + TypeScript** no front-end e **NestJS + PostgreSQL** no back-end ([runner-circle-backend](runner-circle-backend/)).

<p align="center">
  <img src="runner-circle-backend/docs/Desktop%20_%20Vis%C3%A3o%20Geral%20Feed.png" width="85%" alt="Feed do Runner Circle" />
</p>

---

## ✨ Funcionalidades

- **Cadastro e login** com um campo único de "email ou usuário", autenticação JWT e opção **Lembrar-me**
- **Rotas protegidas**: sem token você vai para o login, e um token expirado encerra a sessão sozinho
- **Feed** com os treinos da comunidade e **busca** por descrição, autor ou tipo de treino
- **Nova postagem** com upload de foto, pré-visualização da imagem e validação dos campos
- **Curtidas** em tempo real, com a contagem vinda do servidor
- **Comentários** em uma modal: listar, comentar e excluir os próprios
- **Perfil** com abas **Posts** e **Curtidas**, e edição de nome, usuário, bio e avatar
- Estados de **carregamento, erro e lista vazia** em todas as telas que buscam dados

---

## 🧠 Destaques técnicos

Algumas decisões que valem a leitura do código:

- **Dados com `use()` + Suspense + Error Boundary.** As páginas criam a Promise uma única vez (`useState(() => fetch...())`) e a entregam para um componente filho que a consome com `use()`. Carregamento e erro ficam declarativos, sem `useEffect` + flags de `loading`/`error` espalhadas.
- **Formulários com `useActionState`.** Login, cadastro, nova postagem, edição de perfil e comentários usam Actions do React 19: o estado pendente (`isPending`) e as mensagens de erro vêm de graça, e os valores do cadastro são preservados quando a validação falha.
- **Camada de serviços isolada** (`src/services`). Os componentes não conhecem o axios. Uma instância única injeta o `Authorization: Bearer` em toda requisição, e um interceptor de resposta trata o `401` limpando a sessão. As mensagens de erro da API (`{ message }`) chegam direto na tela por meio de um helper (`getErrorMessage`).
- **Tipos espelhando o contrato da API.** A API trafega números crus (`distanceMeters`, `durationSeconds`) e o front formata na exibição (`4200` vira `"4,2 Km"`, `running` vira `"Corrida"`), com funções puras e testadas em `src/utils/format.ts`.
- **Biblioteca de componentes própria** com CSS Modules. Cada componente estende as props do elemento HTML nativo (`ComponentProps<'button'>` + `...rest`), então aceita `onClick`, `disabled`, `aria-*` etc. sem declarar um por um.
- **React Compiler** ligado: memoização automática, sem `useMemo`/`useCallback` manuais.
- **Acessibilidade:** modal com `role="dialog"` que fecha no `Esc`, botões de ícone com `aria-label`, curtida com `aria-pressed` e erros de formulário com `role="alert"`.

---

## 🛠️ Stack

| Front-end | Back-end |
| --- | --- |
| React 19 (React Compiler) | NestJS 11 |
| TypeScript | TypeORM + PostgreSQL 16 |
| Vite | JWT (Passport) + bcrypt |
| React Router | Multer + sharp (upload → WebP) |
| Axios | Swagger / OpenAPI |
| CSS Modules | Docker Compose |
| Vitest + React Testing Library | |

---

## 🚀 Como rodar localmente

Pré-requisitos: **Node.js 20+** e **Docker**.

### 1. Suba a API

```bash
cd runner-circle-backend
docker compose up --build
```

Esse comando sobe o Postgres, aplica as migrations, popula o banco com dados de exemplo e inicia a API em `http://localhost:3000` (Swagger em `/docs`). Mais detalhes no [README do backend](runner-circle-backend/README.md).

### 2. Suba o front-end

```bash
# na raiz do projeto
cp .env.example .env
npm install
npm run dev
```

Abra `http://localhost:5173` e entre com um usuário de teste:

| Login | Senha |
| --- | --- |
| `julio@example.com` | `secret123` |

### Variáveis de ambiente

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `VITE_API_BASE_URL` | URL base da API | `http://localhost:3000` |

### Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Checagem de tipos (`tsc`) + build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | ESLint |
| `npm test` | Testes com Vitest (modo watch) |

---

## 🗺️ Rotas

| Rota | Página | Acesso |
| --- | --- | --- |
| `/auth/login` | Login | público |
| `/auth/cadastro` | Cadastro | público |
| `/auth/logout` | Encerra a sessão | público |
| `/` | Feed | 🔒 autenticado |
| `/postagem` | Nova postagem | 🔒 autenticado |
| `/perfil` | Perfil (abas Posts / Curtidas) | 🔒 autenticado |
| `/perfil/editar` | Edição de perfil | 🔒 autenticado |

Qualquer outra rota redireciona para o feed.

---

## 🧱 Estrutura

```
runner-circle/
├── runner-circle-backend/   # API NestJS (README próprio)
├── public/images/           # logo e banners
└── src/
    ├── components/          # biblioteca de componentes (um por pasta: index.tsx + .module.css)
    ├── pages/               # telas da aplicação
    ├── services/            # comunicação com a API (axios, token, posts, users, comments)
    ├── utils/               # funções puras de formatação
    ├── App.tsx              # definição das rotas
    └── main.tsx             # ponto de entrada
```

---

## 🧪 Testes

```bash
npm test
```

Os testes usam **Vitest + React Testing Library** e cobrem:

- `PostCard`: renderização dos dados e o fluxo de curtir/descurtir, com o serviço mockado
- `EmptyState`: textos padrão e customizados
- `utils/format`: formatação de duração, distância (pt-BR) e tipo de treino

---

## 🖼️ Telas

| Perfil | Nova postagem |
| --- | --- |
| ![Perfil](runner-circle-backend/docs/Desktop%20_%20Perfil.png) | ![Nova postagem](runner-circle-backend/docs/Desktop%20_%20Criar%20postagem.png) |

| Editar perfil | Login |
| --- | --- |
| ![Editar perfil](runner-circle-backend/docs/Desktop%20_%20Perfil%20-%20Editar.png) | ![Login](runner-circle-backend/docs/Desktop%20_%20Login.png) |

---

## 📈 Próximos passos

- [ ] Paginação infinita no feed (a API já devolve `page`, `limit` e `total`)
- [ ] Cache e revalidação de dados com TanStack Query
- [ ] Perfil público de outros usuários (`/perfil/:username`; o endpoint já existe)
- [ ] Busca feita no servidor
- [ ] Testes de integração das páginas com MSW
- [ ] Layout responsivo para mobile
- [ ] Deploy (front na Vercel e API + banco no Render/Railway)

---

## 📚 Contexto

O projeto nasceu durante a formação de React da [Alura](https://www.alura.com.br/), que forneceu o layout estático (componentes visuais e CSS) e a API base. A partir disso, implementei toda a camada de comportamento do front-end: roteamento e rotas protegidas, integração com a API, autenticação, formulários com Actions, upload de imagem com preview, curtidas, comentários, busca, tratamento de erros e testes.

---

## 👤 Autor

**Fredson Gomes**

[LinkedIn](https://www.linkedin.com/in/fredson--gomes) · [GitHub](https://github.com/Fredsongomes)
