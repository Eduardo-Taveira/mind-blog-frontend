# Blog Frontend — Case Mind Group

Interface web do sistema de blog desenvolvido como case técnico da Mind Group.

Repositório do backend: [https://github.com/Eduardo-Taveira/mind-blog-backend](https://github.com/Eduardo-Taveira/mind-blog-backend)

---

> ⚠️ **Pré-requisito:** o backend precisa estar rodando em `http://localhost:3000` antes de iniciar o frontend.
> Siga o README do backend antes de continuar.

---

## Stack

- React 19 + Vite 8
- TypeScript 6
- Tailwind CSS 4
- React Router DOM v7
- Axios 1.x (com interceptor JWT)
- react-markdown
- react-hot-toast
- lucide-react

---

## Pré-requisitos do ambiente

Instale antes de começar:

- [Node.js 18+](https://nodejs.org) — baixe a versão LTS
- [Git](https://git-scm.com)

---

## Instalação

```bash
git clone https://github.com/Eduardo-Taveira/mind-blog-frontend
cd mind-blog-frontend
npm install
```

> ⚠️ **Atenção:** a pasta criada pelo clone se chama `mind-blog-frontend`, não `blog-frontend`.

---

## Configuração

A URL da API está configurada diretamente em `src/api/axios.ts`:

```ts
baseURL: 'http://localhost:3000/api'
```

Se o backend estiver rodando em outra porta ou endereço, altere esse valor antes de iniciar.

Não há arquivo `.env` necessário para rodar o projeto em desenvolvimento.

---

## Rodando em modo desenvolvimento

Abra um **novo terminal** (separado do terminal do backend) e rode:

```bash
npm run dev
```

Você verá uma mensagem como:
```
VITE v8.x.x  ready in Xms

➜  Local:   http://localhost:5173/
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

> ⚠️ **Certifique-se de que o backend está rodando** antes de abrir o frontend, caso contrário as requisições vão falhar.

---

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`.

---

## Funcionalidades implementadas

**Escopo base:**
- Cadastro e login de usuários
- Autenticação via JWT (token persistido no `localStorage`)
- Listagem de artigos com banner, título, autor e data
- Página de detalhe do artigo
- Criação, edição e exclusão de artigos (rotas protegidas)
- Upload de imagem banner (enviado ao backend como `multipart/form-data`)

**Funcionalidades adicionais (bônus):**
- Dark mode via `ThemeContext`
- Visualização da listagem em modo grid e lista
- Renderização de Markdown no corpo dos artigos (via `react-markdown`)
- Dashboard pessoal com os artigos do próprio usuário
- Página de configurações com edição de nome, email, bio e avatar (via URL)
- Toasts de feedback para ações do usuário (via `react-hot-toast`)
- Contagem de visualizações e curtidas nos artigos
- Sistema de comentários com curtidas

---

## Estrutura de pastas

```
src/
├── api/          # Instância e configuração do axios
├── components/   # Componentes reutilizáveis (Navbar, Footer, ArticleCard, etc.)
├── context/      # Contextos globais (AuthContext, ThemeContext)
├── pages/        # Páginas da aplicação (Home, Articles, Dashboard, etc.)
└── types/        # Interfaces TypeScript (User, Article, Comment)
```
