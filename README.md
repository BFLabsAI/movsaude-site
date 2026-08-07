# MovSaúde — Site institucional

Site multi-página da MovSaúde (Vite + React + TypeScript + Tailwind + Framer Motion).

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Rotas

- `/` — Home
- `/quem-somos`
- `/projetos`
- `/projetos/:slug`
- `/trabalhe-conosco`
- `/contato`
- `/painel` — painel interno (sem link no menu; login próprio)

## Painel (`/painel`)

- Login: usuário/senha (Edge Function `admin-api`, sem Supabase Auth)
- Abas: Dashboard, Contatos (CRM), Candidatos (pipeline + CV)
- Env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

## Deploy

Configurado para Vercel (`vercel.json` com SPA rewrites).
