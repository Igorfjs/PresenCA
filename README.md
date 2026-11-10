# PresenCA

Protótipo front-end do sistema de gestão de presença da comunidade católica Cristo Alegria. Construído com Next.js App Router, React, TypeScript, Tailwind CSS, Lucide, Recharts e Framer Motion. Os dados e serviços são simulados no cliente; não há backend nem persistência.

## Executar localmente

```bash
npm install
npm run dev
npm.cmd run dev (#só esse já basta no pc da fatesg)
```

Abra [http://localhost:3000](http://localhost:3000). O comando `npm run build` gera a versão de produção.

## Estrutura

- `app/`: painel, telas institucionais e rotas de autenticação.
- `components/ui/`: primitivos reutilizáveis no estilo de composição shadcn/ui.
- `hooks/`: hooks de interface, como notificações.
- `lib/`: funções utilitárias.
- `mocks/`: 50 membros, 10 eventos, 5 organizadores, 200 presenças e séries para gráficos.
- `services/`: contrato local entre telas e dados simulados, pronto para conectar a uma API.
- `styles/`: notas sobre o sistema visual; tokens e estilos globais estão em `app/globals.css`.
- `types/`: modelos TypeScript compartilhados.

A busca global pode ser aberta com `Ctrl+K` ou `⌘K`. O menu vira drawer em telas estreitas e a preferência de tema pode ser alternada no cabeçalho.
