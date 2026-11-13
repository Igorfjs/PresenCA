# PRD — PresenCA

**Produto:** PresenCA  
**Comunidade de referência:** Cristo Alegria  
**Tipo de documento:** definição do produto e registro do escopo atual  
**Estado:** protótipo front-end; especificação baseada no repositório atual

## 1. Resumo do produto

PresenCA é um sistema de gestão de eventos e participação comunitária para a comunidade católica Cristo Alegria. O produto organiza informações sobre eventos, séries recorrentes, membros, visitantes e organizadores, e apresenta indicadores e relatórios para apoiar a organização da comunidade.

O sistema será utilizado exclusivamente por administradores e organizadores autorizados.

## 2. Problema e oportunidade

A comunidade precisa organizar encontros recorrentes e eventos avulsos, manter informações de membros e visitantes, saber quem participa e acompanhar a presença ao longo do tempo. Sem uma ferramenta central, essas informações tendem a ficar distribuídas entre planilhas, listas e mensagens.

O PresenCA propõe centralizar a operação em um painel com busca, cadastros, detalhe por evento, séries recorrentes, acompanhamento de status e relatórios. O objetivo do protótipo é validar essa experiência antes da implementação das integrações e regras de produção.

## 3. Objetivos

1. Facilitar a criação e a organização de eventos da comunidade.
2. Permitir que eventos recorrentes reutilizem configurações padrão sem impedir exceções pontuais.
3. Manter uma visão organizada de membros e visitantes, incluindo última visita.
4. Permitir adicionar pessoas a uma ocorrência e acompanhar a situação dos membros.
5. Consolidar dados de ocorrências recorrentes nos relatórios e excluir eventos cancelados dos resultados.
6. Oferecer uma interface responsiva, clara e rápida de navegar para a equipe da comunidade.
7. Estabelecer uma base de interface e modelos que possa receber uma API no futuro.

## 4. Usuários e perfis

| Perfil | Necessidade | Situação no protótipo |
| --- | --- | --- |
| Administrador(a) da comunidade | Organizar eventos, membros, equipe, configurações e relatórios. | Representado por perfil e ações de interface; autenticação e autorização não existem. |
| Organizador(a) | Criar e acompanhar eventos e participantes. | Existe como registro com permissão na tabela, mas as permissões não são aplicadas. |
| Membro | Participar de eventos e ter sua presença acompanhada. | Representado nos dados e na lista de participantes de um evento; não há conta de membro. |
| Visitante/participante | Ser cadastrado pela equipe e participar de encontros ou do grupo informativo. | Cadastro interno demonstrativo; não há auto cadastro público nem persistência real. |

Os rótulos de permissão são demonstrativos e não devem ser considerados um modelo de autorização implementado.

## 5. Princípios de experiência

- Priorizar uma interface administrativa limpa, com conteúdo bem agrupado e ações identificáveis.
- Exibir status e contexto perto do item a que se referem.
- Preencher campos recorrentes com valores padrão para reduzir digitação.
- Diferenciar dados de membros e de visitantes, especialmente no acompanhamento de presença.
- Tratar cancelamento e exceções de agenda de forma explícita.
- Oferecer busca rápida, estados vazios, feedback e confirmação antes de exclusões.
- Funcionar em desktop, tablet e celular, com menu móvel em telas estreitas.
- Não sugerir que uma ação simulada foi persistida ou integrada a um serviço real.

## 6. Escopo do produto

### 6.1 Incluído no protótipo atual

- Painel com indicadores, gráficos e listas demonstrativas.
- Lista de eventos, busca, cadastro de evento avulso e duplicação/exclusão local.
- Modelos de séries recorrentes e associação de ocorrências por `seriesId`.
- Exceção de data em uma ocorrência, sem alterar o dia padrão da série.
- Página interna com dados e participantes de cada evento.
- Inclusão de membros ou visitantes numa ocorrência e status de participação dos membros.
- Tabela de membros, filtros e drawer de perfil.
- Tabela de visitantes e formulário local de participante.
- QR Code estático de convite para o grupo News.
- Tabela de organizadores e formulários demonstrativos.
- Relatórios por série/ocorrência e por período.
- Configurações visuais, perfil e tema.
- Rotas demonstrativas de login, recuperação de senha, acesso negado, manutenção e 404. Cadastros são iniciados pelo painel interno; não há cadastro público.

### 6.2 Fora do escopo atual / depende de evolução

- Backend, banco de dados, persistência e sincronização entre usuários.
- Autenticação, autorização e aplicação real de permissões.
- Geração automática de todas as ocorrências futuras de uma série.
- Envio real de e-mails, notificações ou mensagens.
- Exportação real de PDF ou Excel.
- Relatórios alimentados por registros reais e cálculos auditáveis.
- Configuração de workspace com isolamento efetivo de dados.
- Histórico persistente de alterações, auditoria e trilha de atividade.

## 7. Navegação e arquitetura de informação

### 7.1 Painel principal (`/`)

O shell do painel vive em `app/page.tsx`. A navegação das seções internas é feita por estado React, sem trocar necessariamente a rota do navegador. O menu lateral apresenta:

- Visão geral
- Eventos
- Membros
- Participantes
- Organizadores
- Relatórios
- Configurações
- Meu perfil

O seletor de workspace apresenta Cristo Alegria GYN, Cristo Alegria SP, Cristo Alegria Belém e Cristo Alegria Brasil. A troca é somente visual e não altera a base de dados.

### 7.2 Rotas independentes

| Rota | Propósito atual |
| --- | --- |
| `/login` | Formulário visual de login; envio navega para `/` sem validar credenciais. |
| `/recuperar-senha` | Simula solicitação de recuperação e mensagem de confirmação. |
| `/acesso-negado` | Página informativa para acesso restrito, sem verificação real de perfil. |
| `/manutencao` | Aviso de manutenção e retorno para o início. |
| Caminho inexistente | Página 404 personalizada. |

## 8. Requisitos funcionais

Os identificadores abaixo registram requisitos de produto. O estado indica se o fluxo existe no protótipo, não se está pronto para produção.

| ID | Requisito | Estado |
| --- | --- | --- |
| RF-01 | Exibir indicadores gerais, presença mensal, presença por evento, próximos eventos e atividade recente. | Protótipo com números e gráficos mockados. |
| RF-02 | Pesquisar eventos instantaneamente por texto. | Implementado em estado local. |
| RF-03 | Criar eventos avulsos com nome, descrição, data, hora, local, categoria, responsável, capacidade e observações. | Implementado em estado local. |
| RF-04 | Criar séries recorrentes com configurações padrão de dia da semana, hora, local, categoria, responsável, capacidade e descrição. | Implementado em estado local; salva o template e a primeira ocorrência, não agenda as seguintes. |
| RF-05 | Criar uma ocorrência baseada em série preenchendo os padrões e permitindo ajustes daquela ocorrência. | Implementado em estado local. |
| RF-06 | Permitir exceção de data em ocorrência recorrente mantendo o vínculo à série e o dia padrão intacto. | Implementado pelo campo `scheduleException`. |
| RF-07 | Alterar o status do evento para Confirmado, Em breve ou Cancelado. | Implementado em estado local na tela de detalhes. |
| RF-08 | Excluir evento com confirmação e duplicar uma ocorrência. | Implementado em estado local. |
| RF-09 | Exibir detalhes do evento e participantes inscritos. | Implementado com dados locais/mockados. |
| RF-10 | Adicionar membro ou visitante conhecido a um evento e registrar novo visitante durante o fluxo. | Implementado em estado local. |
| RF-11 | Permitir que membros da lista de um evento tenham status Presente, Ausente ou Justificado. | Implementado em estado local; visitantes não possuem status de presença. |
| RF-12 | Pesquisar e filtrar membros por ministério/grupo e posição. | Implementado em estado local. |
| RF-13 | Exibir dados e última visita de membro em drawer de perfil. | Implementado; parte das atividades e estatísticas é ilustrativa. |
| RF-14 | Listar somente visitantes na tela Participantes, com pesquisa e última visita. | Implementado. |
| RF-15 | Exibir QR Code do grupo informativo News apontando para o convite configurado. | Implementado por imagem de QR servida externamente. |
| RF-16 | Listar e cadastrar organizadores. | Lista mockada; envio do formulário não atualiza uma base persistente. |
| RF-17 | Filtrar relatórios por série/ocorrência e por dia, mês, semestre, ano ou desde o início. | Implementado com os dados locais. |
| RF-18 | Excluir eventos cancelados dos relatórios. | Implementado para cartões, gráfico, tabela e seleção de ocorrências. |
| RF-19 | Alternar o tema claro/escuro do painel. | Alternância visual durante a sessão. |
| RF-20 | Pesquisar páginas/ações por paleta de comandos. | Implementado; atalho `Ctrl+K` ou `⌘K`, quando confirmado no código. |

## 9. Regras de negócio atuais

### 9.1 Eventos e séries recorrentes

- Uma série recorrente representa o padrão do encontro; uma ocorrência é um evento datado vinculado a ela.
- `RecurringEventTemplate.weekday` guarda o dia padrão da semana.
- `EventItem.seriesId` liga a ocorrência ao template da série para permitir consolidação nos relatórios.
- Criar um novo template gera sua primeira ocorrência para o próximo dia configurado. O protótipo não gera um calendário futuro automaticamente.
- Ao criar uma ocorrência de série, a data precisa respeitar o dia padrão, a menos que seja marcada a opção **Alterar data apenas desta ocorrência**.
- Se marcada, a ocorrência recebe `scheduleException: true`, pode acontecer em outro dia, permanece na série e aparece identificada como exceção nos detalhes e relatórios.
- Editar os valores de uma ocorrência não atualiza os padrões do template.
- Status de evento disponível na interface: Confirmado, Em breve e Cancelado.
- Eventos Cancelados não entram nos resultados dos relatórios.

### 9.2 Participação e status de presença

- Um evento pode conter membros e visitantes.
- Membros podem ser marcados como Presente, Ausente ou Justificado.
- Visitantes aparecem na lista do evento sem status de presença.
- Adicionar uma pessoa aumenta a quantidade local de inscritos do evento.
- O menu principal não tem uma tela de gestão de presenças; a edição de status acontece dentro do detalhe do evento.

### 9.3 Membros e visitantes

- Membro tem posição entre Consagrado, Aspirante, Vocacionado e Voluntário, além de grupo/ministério e estado Ativo/Inativo.
- Visitantes ficam separados da lista de membros na tela Participantes.
- O campo Última visita contém data e nome do evento ou ausência de visita registrada.

### 9.4 QR Code do grupo News

- O link do grupo está centralizado em `lib/constants.ts`, na constante `NEWS_GROUP_INVITE_URL`.
- A tela Participantes e Configurações usam o mesmo link.
- O QR não tem expiração controlada pelo PresenCA e não gira automaticamente.
- O QR deixa de funcionar se o convite for redefinido ou invalidado no WhatsApp; nesse caso, o link central deve ser atualizado.
- A imagem é obtida de `api.qrserver.com`, então sua renderização depende de acesso ao serviço externo.
- A página separada “QR Code de presença” não representa este convite: seu padrão, contador, histórico e controles são demonstrativos.

## 10. Relatórios

Os relatórios permitem a seleção de:

- Todos os eventos.
- Uma série recorrente consolidada.
- Uma ocorrência individual.
- Período: Dia, Mês, Semestre, Ano ou Desde o início.

Os indicadores atuais mostram quantidade de ocorrências, inscritos acumulados e média de inscritos. O gráfico agrupa inscritos por mês e a tabela lista ocorrência, data, série, inscritos e status. Exceções de data continuam associadas à série e recebem indicação própria. Cancelados são removidos antes da agregação. O botão de exportação atualmente apenas exibe feedback; PDF ou Excel ainda não são gerados.

## 11. Entidades e campos principais

| Entidade | Campos relevantes no protótipo |
| --- | --- |
| Membro/participante | ID, nome, data de nascimento, telefone, e-mail, cidade, grupo, posição, status, ingresso, avatar, percentual de presença e última visita. Participantes usam o mesmo tipo `Member`, distinguindo-se pelo grupo e faixa de IDs na implementação atual. |
| Evento/ocorrência | ID, nome, tipo, data, hora, local, responsável, status, inscritos, descrição, capacidade, observações, `seriesId` e `scheduleException`. |
| Série recorrente | ID, nome, categoria, dia da semana, hora, local, responsável, capacidade, descrição e observações. |
| Organizador | ID, nome, permissão, e-mail, telefone e status. |
| Registro de participação | ID, membro/participante, evento e status local. Visitantes podem aparecer sem status aplicável. |

Os dados de demonstração incluem aproximadamente 50 membros, 10 eventos, 5 séries recorrentes, 5 organizadores e 200 registros de presença em `mocks/data.ts`. Os participantes iniciais são definidos em `app/page.tsx`. Indicadores e gráficos não devem ser tratados como métricas operacionais atuais.

## 12. Requisitos não funcionais e experiência

- Idioma principal: português do Brasil.
- Interface responsiva para desktop, tablet e celular.
- Menu lateral deve permitir navegação em telas grandes e funcionar como menu móvel em telas menores.
- Tema claro/escuro, com tema escuro inicial no painel.
- Feedback visual para ações locais, animações pequenas e transições de overlay.
- Busca global com paleta de comandos e `Escape` para fechar overlays.
- Tabelas devem manter usabilidade em telas estreitas, usando rolagem horizontal quando necessário.
- Componentes visuais devem reutilizar estilos, tokens e primitivos existentes.

## 13. Métricas de sucesso para evolução

As métricas abaixo são propostas para quando houver backend e telemetria; não são coletadas pelo protótipo:

- Tempo médio para criar um evento e uma série recorrente.
- Percentual de eventos recorrentes criados sem retrabalho de configuração.
- Taxa de conclusão de inclusão de participante numa ocorrência.
- Percentual de ocorrências com status de membros atualizado após o evento.
- Uso dos filtros de série e período nos relatórios.
- Redução de falhas ou duplicidades em listas de participantes.

## 14. Dependências e riscos

- A dependência do serviço externo de QR pode impedir a exibição do código em ambientes sem internet ou se o serviço estiver indisponível.
- O convite do WhatsApp é um link compartilhável e pode ser encaminhado por terceiros. O administrador deve redefini-lo no WhatsApp se precisar invalidá-lo.
- Sem persistência, alterações locais são perdidas ao recarregar e não são compartilhadas com outros usuários.
- Os números de painel, gráficos, histórico de presença e parte das informações de perfil são mocks e não podem apoiar decisões reais.
- A arquitetura concentra o shell e a maioria das telas em `app/page.tsx`; a evolução deve avaliar separar telas, estado e regras de domínio.
- O login não protege o painel e permissões de organizador não são aplicadas.

## 15. Próximas decisões para produto

Antes de produção, definir e validar com a comunidade:

1. Como e quando serão criadas as ocorrências futuras: geração automática, criação manual ou ambos.
2. Como editar ou cancelar uma série inteira versus uma única ocorrência.
3. Se uma exceção precisa de justificativa, histórico ou aprovação.
4. Se a troca de data deve notificar membros e visitantes, e por quais canais.
5. Quais permissões existem de fato e o que cada papel pode ver ou alterar.
6. Quais dados pessoais são obrigatórios, por quanto tempo serão guardados e quem pode acessá-los.
7. Se visitantes precisam de cadastro único e como evitar duplicidades.
8. Como serão calculados presença, ausência, justificativa, inscritos e médias nos relatórios.
9. Quem pode redefinir o convite News e como atualizar o QR após uma redefinição.
10. Quais formatos e filtros devem ser incluídos na exportação real.
