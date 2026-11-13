# Documentação do PresenCA

## 1. Visão geral

PresenCA é um protótipo front-end para organizar eventos, membros e visitantes da comunidade católica Cristo Alegria. A interface foi desenhada como um painel administrativo SaaS, com navegação lateral, tema escuro/claro, tabelas pesquisáveis, formulários, modais e telas responsivas.

O painel demonstra fluxos para administradores e organizadores e continua usando arrays locais. O repositório possui uma base NestJS, um health check e um schema Prisma/PostgreSQL inicial, mas ainda não tem operações de negócio integradas, persistência das telas ou autenticação real. As alterações principais são mantidas em estado React durante a sessão e em geral desaparecem ao recarregar. O formulário de login não valida credenciais e o formulário de recuperação apenas simula uma confirmação. Não há rota pública de auto cadastro: os cadastros são iniciados nas telas internas do painel.

Há interações realmente implementadas no navegador, como alternar telas, filtrar e pesquisar listas, criar ocorrências de eventos em estado local, alterar status e abrir drawers ou modais. Outras ações, como exportar, salvar algumas configurações, trocar a foto ou solicitar uma alteração de senha, mostram somente feedback visual.

## 2. Stack e execução

- Next.js 14 com App Router.
- React 18 e TypeScript.
- Tailwind CSS configurado em `tailwind.config.ts`; a maior parte do visual atual usa classes e tokens CSS próprios em `app/globals.css`.
- Lucide React para ícones.
- Framer Motion para animações de drawers, menus e modais.
- Recharts para os gráficos do painel e relatórios.
- `clsx` e `tailwind-merge` para composição de classes nos primitivos reutilizáveis.
- React Hook Form e Zod estão declarados nas dependências, mas os formulários atuais usam elementos HTML nativos e estado React.

Comandos definidos em `package.json`:

| Comando | Uso |
| --- | --- |
| `npm install` | Instala as dependências. No PowerShell do Windows, pode ser necessário usar `npm.cmd install`. |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Gera a build de produção. |
| `npm start` | Inicia o servidor de produção depois da build. |
| `npm run lint` | Executa `next lint`. |

Não existe script de testes automatizados no `package.json`.

## 3. Estrutura de pastas

```text
app/
  acesso-negado/page.tsx     Tela de acesso restrito
  login/page.tsx             Login demonstrativo
  manutencao/page.tsx        Aviso de manutenção
  participar/page.tsx        Cadastro público simplificado
  recuperar-senha/page.tsx   Recuperação simulada
  globals.css                Tokens, componentes visuais e responsividade
  layout.tsx                 Layout HTML e metadados compartilhados
  loading.tsx                Skeleton de carregamento do painel
  not-found.tsx              Página 404
  page.tsx                   Shell do painel e principais telas internas
components/
  brand-logo.tsx             Logo compartilhada
  ui/primitives.tsx          Primitivos de UI em estilo de composição shadcn
hooks/
  use-toast.ts               Hook local de notificações toast
lib/
  constants.ts               Configurações estáticas compartilhadas, como link do News
  utils.ts                   Funções auxiliares, como cn, initials e formatDate
mocks/
  data.ts                    Membros, eventos, séries, presenças e organizadores
  logoCA.png                 Logo da comunidade
services/
  mock-api.ts                Camada de serviço local assíncrona
styles/
  README.md                  Notas sobre o sistema visual
types/
  index.ts                   Tipos compartilhados
```

Arquivos de configuração relevantes na raiz: `package.json`, `package-lock.json`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs` e `next.config.mjs`. Não existe pasta `pages/`; as rotas usam o App Router.

## 4. Navegação e arquitetura

### Rotas do App Router

As pastas dentro de `app/` definem rotas próprias, como `/login`, `/recuperar-senha`, `/acesso-negado` e `/manutencao`. `app/not-found.tsx` fornece a tela para caminhos inexistentes.

### Telas internas do painel

`app/page.tsx` contém o shell do painel e a maioria das telas administrativas. O estado `page` alterna entre Dashboard, Eventos, Membros, Participantes, Organizadores, Relatórios, Configurações, Meu perfil e QR Code. Essa navegação ocorre dentro da rota `/`; em geral, trocar de seção não altera a URL.

O menu lateral exibe as seções principais. Em telas pequenas, ele se transforma em menu móvel. A seleção de workspace oferece Cristo Alegria GYN, SP, Belém e Brasil, mas serve apenas para demonstrar a seleção: não troca os dados exibidos nem delimita permissões.

O layout compartilhado em `app/layout.tsx` define o idioma, metadados e importa `app/globals.css`. O CSS contém tokens de cor, tema, layout, estados e breakpoints. A classe `.dark` altera as variáveis visuais; a aplicação principal inicia no tema escuro. A tela de login tem fundo verde próprio.

O painel inclui pesquisa global e paleta de comandos aberta por `Ctrl+K` ou `⌘K`; `Escape` fecha overlays e busca. O avatar permite abrir a área Meu perfil. A navegação e vários formulários mostram notificações em toast ou banners locais.

## 5. Telas internas do painel

### Visão geral / Dashboard

Apresenta uma saudação, botão para criar evento, quatro indicadores (membros, presentes, faltas e eventos), gráfico mensal de presença, gráfico comparativo por evento, próximos eventos e últimos check-ins. Os números e gráficos são valores de demonstração de `mocks/data.ts` ou constantes em `app/page.tsx`; não refletem automaticamente as alterações feitas nas listas. Clicar em Novo evento abre o formulário de evento. Links de eventos levam à seção Eventos.

### Eventos

A tabela apresenta nome, tipo, data e hora, local, responsável, status e inscritos. A busca filtra a lista enquanto se digita. O botão de filtros e a ação de exportar atualmente exibem mensagens demonstrativas. O botão Novo evento abre um modal.

No formulário, é possível criar um evento avulso ou escolher uma série recorrente. Ao escolher uma série, os dados padrão são preenchidos e podem ser ajustados para aquela ocorrência. Por padrão, a data precisa corresponder ao dia da semana configurado para a série. A opção **Alterar data apenas desta ocorrência** permite escolher outro dia, sem alterar o padrão da série; a ocorrência continua conectada à série e é identificada como exceção nos detalhes e relatórios. A opção Novo evento recorrente abre o cadastro de uma série, com nome, categoria, dia da semana, horário, local, responsável, capacidade, descrição e observações. Ao salvar, a série é adicionada ao estado local e sua primeira ocorrência é criada para o próximo dia configurado.

Cada linha abre uma página interna de detalhes do evento. Nela aparecem dados do encontro, inscritos, vagas e lista de participantes. É possível alterar o status do evento para Confirmado, Em breve ou Cancelado. Para adicionar pessoas, a janela permite escolher um membro ou participante já cadastrado, ou fazer um novo cadastro de visitante. Membros podem receber status Presente, Ausente ou Justificado; visitantes não têm status de presença. As atualizações são mantidas em estado React e não são persistidas no servidor.

As ações de duplicar e excluir ficam no menu da linha. A duplicação cria uma cópia local com status Em breve. A exclusão solicita confirmação antes de remover o evento do estado atual.

Eventos recorrentes são conectados às ocorrências pelo campo opcional `seriesId`. Essa chave permite que os relatórios agreguem ocorrências de uma mesma série. A criação de série não agenda todas as ocorrências futuras automaticamente; cria o template e a primeira ocorrência.

### Membros

A tela tem busca instantânea, filtros por ministério e posição, indicadores e uma tabela com foto, nome, telefone, cidade, ministério/grupo, posição, status, data de ingresso e última visita. A tabela mostra uma página limitada de resultados. O botão Novo membro abre formulário local com dados de contato, cidade e posição. A opção Grupo foi substituída por Posição no cadastro.

Selecionar uma linha abre um drawer com dados pessoais e de contato, cidade, grupo, ingresso, status, última visita, percentual e gráfico visual de presença, atividades recentes e observações. Parte das informações do drawer, como atividades, é conteúdo fixo de demonstração. O botão Editar membro não salva alterações.

### Participantes

A lista contém visitantes/participantes, sem incluir membros. Há busca por nome, telefone, cidade ou evento e colunas de contato, cidade e última visita. O botão Novo participante abre um cadastro local de visitante, disponível no painel interno; participantes cadastrados por esse fluxo aparecem na lista durante a sessão. Não existe auto cadastro público.

O card “Convide para o News” contém o botão Abrir QR Code. Ele abre um modal com um QR que codifica `NEWS_GROUP_INVITE_URL`, constante compartilhada de `lib/constants.ts`. A imagem é solicitada ao serviço externo `api.qrserver.com`; portanto, a exibição do QR depende de conexão com esse serviço. O QR é estático e o PresenCA não aplica expiração; ele deixa de funcionar se o link for redefinido ou invalidado no WhatsApp. A lista de participantes não representa membros.

### Organizadores

A tabela exibe nome, permissão, e-mail, telefone e status com dados mockados. Adicionar organizador abre um formulário e atualiza o feedback da interface, mas os dados não são gravados em uma API. O menu de cada linha apenas informa que o organizador está sendo gerenciado; não implementa edição ou remoção real.

### Relatórios

Os filtros permitem escolher todos os eventos, uma série recorrente consolidada ou uma ocorrência individual, além do período dia, mês, semestre, ano ou desde o início. Os controles de data definem o período de referência. A página apresenta quantidade de ocorrências, total e média de inscritos, gráfico mensal e tabela das ocorrências filtradas.

Eventos com status Cancelado são removidos dos dados do relatório, inclusive das métricas, do gráfico, da tabela e da lista de ocorrências individuais. Ocorrências de uma série são relacionadas por `seriesId`. O botão de exportar apenas mostra uma notificação; não gera PDF ou Excel.

### Configurações

Inclui dados da comunidade, aparência/tema e seção do QR Code do grupo News. A seção mostra o link fixo compartilhado com a tela Participantes, oferece cópia para a área de transferência e informa que o PresenCA não aplica expiração ao QR. A validade depende do convite permanecer ativo no WhatsApp. O tema escuro/claro altera efetivamente o estado visual do shell durante a sessão. Nome e e-mail são controles de demonstração; o botão Salvar mostra feedback sem persistir esses valores. Logo e integrações futuras não têm fluxo funcional nesta tela.

### Meu perfil

Tem abas de Dados pessoais, Segurança, Preferências e Notificações. Mostra dados de perfil, botão para alterar foto, solicitação de alteração de senha, preferências de e-mail e botão de sair. Salvar e alterar foto/senha mostram notificações; o botão de sair também mostra feedback, mas não encerra uma sessão autenticada. O toggle de notificações altera visualmente sua classe durante a sessão.

### QR Code

É uma ferramenta acessível pela paleta de comandos, não uma aba Presenças no menu lateral. A página mostra um QR decorativo, cronômetro com reinício visual, dados fixos de evento, contadores, histórico e controles de gerar, baixar ou copiar. O padrão do QR não codifica um link real, as ações de baixar/selecionar evento são apenas notificações e estatísticas/histórico são mockados. Esta ferramenta não é a tela de presença nem está integrada ao convite de WhatsApp mostrado em Participantes.

## 6. Rotas independentes

| Rota | Fluxo e limites |
| --- | --- |
| `/login` | Formulário de login e senha, com opção visual de mostrar/ocultar senha. Não valida credenciais nem cria sessão; o envio encaminha para `/`. |
| `/recuperar-senha` | Solicita e-mail e mostra uma confirmação simulada. Nenhum e-mail é enviado. |
| `/acesso-negado` | Tela informativa com atalhos para o início e solicitação de acesso por e-mail. |
| `/manutencao` | Aviso de manutenção e link para tentar novamente no início. |
| Caminho inexistente | Página 404 personalizada em `app/not-found.tsx`, com ação de voltar e ir ao início. |
| Carregamento do painel | `app/loading.tsx` mostra skeleton de sidebar, indicadores, gráfico e listas. |

Não há middleware protegendo o painel: o acesso à rota principal não depende do login de demonstração.

## 7. Dados e modelos

`mocks/data.ts` contém 50 membros, 10 eventos, 5 séries recorrentes, 5 organizadores e 200 registros de presença, além de valores mensais e agregações por evento para gráficos. Os quatro participantes iniciais são definidos em `app/page.tsx` como `registeredParticipants`. Os dados usam nomes, cidades e informações fictícias ou demonstrativas.

Os principais tipos de `types/index.ts` são:

- `Member`: dados pessoais, telefone, cidade, grupo, posição, status, ingresso, avatar, percentual de presença e última visita opcional.
- `LastVisit`: data e nome do evento da última visita, ou `null`.
- `EventItem`: dados de evento, status, inscritos e campos opcionais de descrição, capacidade, observações e `seriesId`.
- `RecurringEventTemplate`: configurações padrão de uma série, incluindo dia da semana, horário, local, responsável e capacidade.
- `Organizer`: contato, permissão e status do organizador.

`seriesId` guarda o identificador da série recorrente em cada ocorrência e é usado pelos relatórios para consolidar os eventos associados. `EventItem.scheduleException` indica que aquela ocorrência tem uma data excepcional; esse campo não altera o dia padrão definido em `RecurringEventTemplate`.

## 8. Componentes e interações reutilizáveis

Em `app/page.tsx`, funções compartilhadas incluem `Avatar`, `Badge`, `SectionTitle`, `CardHead`, `IconButton`, `StatCard`, `EmptyState`, `CommandPalette` e `FormModal`. Também há componentes específicos para detalhes de evento, cadastro de participante no evento, drawer de membro e seleção de workspace.

`components/ui/primitives.tsx` fornece Button, Card, cabeçalho e conteúdo de card, Badge e Skeleton. São primitivos próprios com composição inspirada em shadcn/ui; a aplicação não usa o pacote oficial `shadcn/ui` nem seus componentes gerados para as telas principais. `components/brand-logo.tsx` encapsula a imagem `mocks/logoCA.png` usando `next/image`.

`hooks/use-toast.ts` fornece um hook toast local. O shell principal usa seu próprio estado de aviso para mensagens temporárias. `lib/utils.ts` contém `cn`, `initials` e `formatDate`. `app/loading.tsx` usa o Skeleton compartilhado.

Framer Motion anima menus, drawers e modais. Tabelas podem rolar horizontalmente em telas estreitas; a sidebar muda para um menu móvel com botão hambúrguer e overlay. Os breakpoints e os estilos responsivos ficam principalmente em `app/globals.css`.

## 9. Limitações e integração futura

### Funcionalidade local

- Pesquisa e filtros executados no navegador.
- Mudança de seção pelo estado do painel.
- Abertura e fechamento de modais e drawers.
- Criação local de eventos, séries, membros e participantes em alguns fluxos.
- Alteração local do status de evento e de membro em evento.
- Tema alternado durante a sessão.
- Temporizador demonstrativo na página QR Code.

### Feedback sem operação real

- Exportar tabelas e relatórios.
- Salvar configurações e perfil.
- Alterar senha ou foto.
- Enviar e-mail de recuperação.
- Login, logout e controle de permissões.
- Trocar evento na tela QR de presença e baixar seu código.
- Gerenciar organizadores pela ação contextual.

### Dados e integrações

- As listas e gráficos principais derivam de mocks ou valores fixos.
- `services/mock-api.ts` aguarda um intervalo curto e retorna arrays locais; não chama uma API externa.
- O QR do grupo News é a exceção: sua imagem é carregada por `api.qrserver.com`, com o link fixo centralizado em `lib/constants.ts`.
- O QR da ferramenta de presença é apenas uma composição visual e não representa um código escaneável funcional.

Uma implementação real exigirá API e persistência para entidades e presença; autenticação e autorização; validação de dados; envio real de mensagens; exportação de arquivos; configuração segura do link de convite e substituição dos números e históricos mockados. Também será necessário definir se a troca de workspace deve filtrar dados e usuários.

## 10. Manutenção e evolução

- Altere membros, eventos, séries, organizadores e registros de presença em `mocks/data.ts`.
- Atualize os modelos em `types/index.ts` e mantenha mocks, formulários e telas compatíveis com esses tipos.
- A maioria das telas internas e do estado do painel está concentrada em `app/page.tsx`; esse é o arquivo principal para ajustar fluxos administrativos.
- As rotas públicas e informativas têm arquivos próprios em `app/<rota>/page.tsx`.
- Ajuste tokens, tema, componentes visuais e breakpoints em `app/globals.css`.
- Reutilize ou amplie os primitivos de `components/ui/primitives.tsx`; mantenha identidade visual e logo em `components/brand-logo.tsx` e `mocks/logoCA.png`.
- Substitua as funções de `services/mock-api.ts` por chamadas HTTP quando a API existir. Depois, mova o estado de negócio para uma camada apropriada e defina tratamento de erros, carregamento e persistência.
- Revise o README junto das mudanças: ele pode ficar desatualizado em relação à implementação, por exemplo sobre navegação e recursos demonstrativos.
