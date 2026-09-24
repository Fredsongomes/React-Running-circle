# 🏃 Runner Circle

**A rede social de quem corre — e o projeto do segundo curso de React da Alura.**

As pessoas publicam treinos (foto, tempo, distância, calorias, batimentos), curtem, comentam e visitam perfis. Tudo isso vai existir de verdade até o fim do curso. Por enquanto, o que você tem em mãos é o **layout completo, estático e sem nenhum comportamento**.

---

## Por que o layout já vem pronto?

Porque você já provou que sabe fazer isso.

No curso anterior você montou o Fokus do zero: componentes, props, hooks, CSS Modules, TypeScript, build e deploy. Repetir esse trabalho aqui não te ensinaria nada novo — só custaria umas boas horas escrevendo CSS.

O foco deste curso é outro: **comportamento**. Navegação, dados vindos de uma API real, autenticação, upload de imagem, interações sociais e testes. É a camada que transforma uma tela bonita em um aplicativo.

Então a divisão é essa:

| Já está pronto | Você vai construir |
| --- | --- |
| 6 páginas estáticas | Rotas e navegação (React Router) |
| Biblioteca de componentes | Consumo de API (fetch → axios) |
| CSS Modules e paleta | Cadastro, login e JWT |
| Tipagens de props | Context do usuário logado e rotas protegidas |
| Ícones (lucide-react) | Upload de imagem com `multipart/form-data` |
| Dados falsos ("mockados") | Curtidas, comentários, abas via URL |
| | Testes com Vitest + React Testing Library |

---

## 🚀 Começando

Pré-requisito: **Node.js 20 ou superior**.

```bash
# clone o repositório
git clone https://github.com/viniciosneves/runner-circle.git
cd runner-circle

# instale as dependências
npm install

# suba o servidor de desenvolvimento
npm run dev
```

Abra o endereço que o Vite mostrar no terminal (geralmente `http://localhost:5173`).

### Scripts disponíveis

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload |
| `npm run build` | Checa os tipos (`tsc`) e gera o build de produção |
| `npm run preview` | Serve o build de produção localmente |
| `npm run lint` | Roda o ESLint no projeto |

---

## 👀 O que você vai ver ao abrir

Um susto proposital: **as seis páginas renderizadas uma embaixo da outra**, numa rolagem infinita.

Isso não é bug. É o ponto de partida do curso. Dá uma olhada no [App.tsx](src/App.tsx):

```tsx
function App() {
  return <>
    <Register />
    <Login />
    <Feed />
    <NewPost />
    <Profile />
    <EditProfile />
  </>
}
```

Sem rota, sem estado, sem dado real. As páginas existem, mas não há nada que decida **qual** delas mostrar — porque é exatamente isso que você vai ensinar o app a fazer na aula 1.

> 💡 **Dica pra explorar sozinha:** comente as outras e deixe só uma página por vez. É a forma mais rápida de ver cada tela isolada antes de começar.

---

## 🗺️ As seis páginas

| Página | Arquivo | Rota que ela vai ganhar | O que tem nela |
| --- | --- | --- | --- |
| **Login** | [src/pages/Login/](src/pages/Login/) | `/login` | Formulário de acesso, banner lateral, link pro cadastro |
| **Register** | [src/pages/Register/](src/pages/Register/) | `/cadastro` | Nome, email e senha, link pro login |
| **Feed** | [src/pages/Feed/](src/pages/Feed/) | `/` | Busca + grid de treinos publicados |
| **NewPost** | [src/pages/NewPost/](src/pages/NewPost/) | `/nova-postagem` | Upload de foto + campos do treino + tipo (caminhada/corrida) |
| **Profile** | [src/pages/Profile/](src/pages/Profile/) | `/perfil` | Cabeçalho do perfil, abas Posts/Curtidas, grid de posts |
| **EditProfile** | [src/pages/EditProfile/](src/pages/EditProfile/) | `/perfil/editar` | Troca de avatar, usuário, nome e bio |

---

## 🧱 Estrutura de pastas

```
runner-circle/
├── public/
│   ├── favicon.svg
│   └── images/          # logo, banners das telas de auth, padrão de fundo
└── src/
    ├── components/      # a biblioteca de componentes (um por pasta)
    │   ├── Button/
    │   │   ├── Button.module.css
    │   │   └── index.tsx
    │   └── icons/       # ícones em SVG que o lucide-react não tem
    ├── pages/           # as seis telas
    ├── App.tsx          # hoje: a pilha de páginas. amanhã: o router
    ├── main.tsx         # o ponto de entrada, com o createRoot
    └── index.css        # reset + variáveis de cor e fonte
```

A convenção é a mesma do curso anterior: **uma pasta por componente**, com `index.tsx` e o `.module.css` ao lado. O import fica limpinho (`import Button from '../Button'`) e o CSS nunca vaza pra fora do componente.

---

## 🧩 A biblioteca de componentes

São mais de 30 componentes prontos. Você não precisa decorar — mas vale saber que eles existem, porque **quase sempre a peça que você precisa já está na caixa**.

**Estrutura e navegação**
`AppLayout` (a área logada, com a sidebar) · `AuthLayout` (as telas de login/cadastro, com o banner) · `Sidebar` · `NavItem` · `Logo` · `Columns` · `Divider`

**Formulários**
`Form` · `FormField` (label + campo, já ligados) · `FormActions` · `Input` · `Textarea` · `TimeInput` · `Checkbox` · `Radio` · `RadioGroup` · `SearchInput` · `Button` · `Label`

**Conteúdo e feed**
`PostCard` · `PostsGrid` · `StatChip` (os chips de distância/calorias/batimentos) · `Tag` · `Avatar` · `ImagePlaceholder` · `EmptyState` · `Text` · `Title`

**Perfil e interações**
`ProfileHeader` · `Tabs` + `Tab` · `Modal` · `CommentsModal` · `Comment`

**Upload**
`ImageUploader` · `FileItem`

**Auth social**
`SocialLogin` · `AuthLink` · `icons/GoogleIcon`

### O padrão de props que eles seguem

Todos usam a mesma receita: `ComponentProps` do elemento HTML + as props específicas, com `...rest` no final pra repassar o que sobrou.

```tsx
type ButtonProps = ComponentProps<'button'> & {
  variant?: 'primary' | 'outline'
  icon?: ReactNode
}

function Button({ children, icon, variant = 'primary', type = 'button', ...rest }: ButtonProps) {
  return (
    <button className={`${styles.button} ${styles[variant]}`} type={type} {...rest}>
      {children}
      {icon}
    </button>
  )
}
```

Traduzindo: o `Button` aceita **qualquer** atributo de um `<button>` de verdade — `onClick`, `disabled`, `aria-label` — sem precisar declarar um por um. Quando você for plugar comportamento nos componentes, é esse `...rest` que vai te salvar.

### Peças que ainda não estão plugadas

Alguns componentes existem no projeto mas não são usados por nenhuma página ainda. Não é esquecimento — é encomenda pro futuro:

- **`Modal` e `CommentsModal`** — a modal de comentários da aula 5. Repare que o `Modal` é **controlado por props** (`open` + `onClose`) e não guarda estado nenhum por dentro: quem decide se ele abre é quem o usa.
- **`EmptyState`** — a tela de "nada por aqui ainda", que entra quando o feed vier vazio da API (aula 2).

---

## 🎨 Design system

As cores e a fonte vivem como variáveis CSS no [index.css](src/index.css). Use as variáveis, não os valores crus.

| Variável | Valor | Onde aparece |
| --- | --- | --- |
| `--lime` | `#C6FF3F` | Botões primários, destaques |
| `--bg` | `#F8FFE0` | Fundo das páginas |
| `--dark` | `#17181C` | Sidebar, textos fortes |
| `--blue` | `#587FEE` | Links e ações secundárias |
| `--text` | `#1B1B1B` | Texto padrão |
| `--gray-input` | `#E2E2E2` | Fundo dos campos |
| `--gray` | `#8F8F8F` | Textos de apoio, placeholders |
| `--font` | `Chakra Petch` | Toda a tipografia |

A fonte vem do Google Fonts, carregada no [index.html](index.html).

---

## 🛠️ Stack

| Ferramenta | Papel |
| --- | --- |
| **React 19** | A biblioteca de UI — com React Compiler ligado |
| **TypeScript** | Tipagem das props e dos dados |
| **Vite** | Servidor de dev e build |
| **CSS Modules** | Estilo com escopo por componente |
| **lucide-react** | Os ícones |
| **ESLint** | Padronização e regras dos hooks |

Ao longo do curso entram: **react-router**, **axios**, **Vitest** e **React Testing Library**.

---

## 📈 Para onde esse projeto vai

```
aula 01  páginas empilhadas  →  SPA com rotas e navegação
aula 02  feed com dados reais da API (fetch → axios)
aula 03  auth completa: cadastro, login, JWT, context, rotas protegidas
aula 04  criar postagem com foto (multipart + preview)
aula 05  perfil com abas na URL, avatar, curtidas e comentários
aula 06  testes com Vitest + RTL protegendo o app inteiro
```

No fim, o Runner Circle sai daqui como um app completo — e você sai com o be-a-bá de React fechado.

---

## 🎒 O que este curso assume que você já tem

Este é o segundo curso. Ele parte do princípio de que as ferramentas abaixo já estão no seu músculo:

- Componentes e props
- `useState` e como o React decide re-renderizar
- `useEffect` (e a função de limpeza)
- `useRef`
- `useActionState` + `FormData`
- Listas e `key`
- TypeScript: interfaces, unions, tipos de props
- Build e deploy

Se algum item dessa lista soou nebuloso, **volte antes de seguir**. Rever o vídeo certo do curso anterior custa minutos; seguir com um buraco na base custa o curso inteiro. Essas ferramentas não vão ser reapresentadas aqui — elas vão ser usadas.

---

## ⚙️ Uma última coisa antes de começar

Ainda na aula 1, você vai instalar a extensão **React Developer Tools** ([Chrome](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) · [Firefox](https://addons.mozilla.org/firefox/addon/react-devtools/)). É o "inspecionar elemento" do mundo React: em vez de `div`s, você enxerga a árvore de componentes ao vivo e as props que cada um recebeu.

Com o projeto rodando, abra a aba **Components** e clique em um card do feed. Você vai ver as props do `PostCard` preenchidas — e vai entender esse projeto muito mais rápido do que lendo arquivo por arquivo.

**Bons treinos. Bora codar. 🏃‍♀️💨**
