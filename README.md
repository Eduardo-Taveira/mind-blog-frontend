# Blog Frontend — Case Mind Group

Interface web do sistema de blog desenvolvido como case técnico da Mind Group.

---

> **Pré-requisito:** o backend precisa estar rodando em `http://localhost:3000` antes de iniciar o frontend.
> Repositório do backend: [REPO-BACKEND-URL]

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

- Node.js 18+
- npm

---

## Instalação

```bash
git clone <URL-DESTE-REPOSITÓRIO>
cd blog-frontend
npm install
```

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

```bash
npm run dev
```

Acesse em: [http://localhost:5173](http://localhost:5173)

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