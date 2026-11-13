# Regras de Negócio (Business Rules)

# Projeto PresenCA

**Versão:** 1.0  
**Status:** Em elaboração  
**Escopo:** comportamento atualmente implementado e regras propostas para evolução

---

## Como ler este documento

Este documento consolida as regras observáveis no protótipo com as regras propostas para a versão futura do produto.

- **Implementada:** comportamento confirmado no código atual.
- **Parcial / demonstrativa:** há uma interface ou parte do fluxo, mas não há persistência, autorização ou integração real.
- **A implementar:** regra trazida como definição futura; não deve ser presumida como comportamento atual.
- **Decisão pendente:** fontes descrevem regras diferentes ou falta uma definição de produto. Até a decisão, prevalece o comportamento implementado, sem inferir equivalências.

O projeto é front-end demonstrativo. Não possui backend, banco de dados, autenticação, autorização ou armazenamento persistente. A palavra “deverá” nas regras **A implementar** descreve o produto desejado, não uma capacidade já disponível.

## 1. Objetivo

Definir como o PresenCA organiza eventos, séries recorrentes, pessoas, participação, acesso e histórico para a comunidade Cristo Alegria. As regras precisam permanecer compreensíveis independentemente da tecnologia usada na futura implementação.

## 2. Usuários e permissões

### 2.1 Administrador

**Regra proposta — A implementar:** o sistema terá um perfil autenticado de administrador com acesso total para:

- cadastrar organizadores, membros e participantes;
- cadastrar e editar eventos;
- consultar relatórios;
- configurar o sistema e alterar permissões;
- excluir registros conforme a política de exclusão lógica definida neste documento.

**Estado atual — Parcial / demonstrativo:** o painel contém formulários e telas destinadas à equipe. Não há login real, cadastro efetivo de permissões nem verificação de perfil. O formulário de participante altera uma lista React local; os formulários de membro e organizador exibem feedback, mas não adicionam registros às listas atuais.

### 2.2 Organizador

**Regra proposta — A implementar:** o organizador terá acesso operacional para visualizar eventos, registrar presença e consultar membros e participantes. Não poderá:

- excluir usuários ou eventos;
- alterar configurações do sistema;
- alterar permissões.

**Estado atual — Parcial / demonstrativo:** organizadores aparecem em uma tabela com permissão, mas os valores não protegem telas nem controlam ações. A tela de acesso negado também não verifica o perfil autenticado.

### 2.3 Autenticação e acesso

**Regra proposta — A implementar:** somente usuários autenticados poderão acessar o painel e cada ação deverá respeitar o perfil e a permissão associados ao usuário.

**Estado atual:** `/login` não valida credenciais e redireciona para o painel. Não há middleware ou sessão, portanto não existe restrição técnica ao painel.

## 3. Pessoas

O domínio prevê dois tipos de pessoa: **Membro** e **Participante** (visitante).

### 3.1 Membro

**Definição:** pessoa pertencente à comunidade Cristo Alegria.

**Regras propostas:**

- manter cadastro e histórico de presença e ausência;
- permitir participação em qualquer evento;
- controlar faltas somente para membros.

**Estado atual:** membros têm dados mockados de contato, cidade, grupo, posição, status, ingresso, percentual de presença e última visita. A posição pode ser Consagrado, Aspirante, Vocacionado ou Voluntário; o status nos dados pode ser Ativo ou Inativo. A tela Novo membro não persiste um novo membro.

### 3.2 Participante / visitante

**Definição:** pessoa visitante da comunidade.

**Regras propostas:**

- manter cadastro simplificado;
- permitir registro em eventos;
- não manter histórico de faltas.

**Estado atual:** participantes ficam em uma lista separada dos membros. O cadastro administrativo gera um registro local com grupo Participante, posição Voluntário, status Ativo, presença inicial zero e última visita vazia. A rota pública `/participar` foi removida: não há auto cadastro. O cadastro atual é iniciado no painel, mas o protótipo ainda não autentica nem restringe o acesso por perfil.

### 3.3 Identificação única e duplicidades

**Regra proposta — A implementar:** não deve haver dois cadastros da mesma pessoa. Se CPF for adotado, deverá ser único; se não for, deverá existir uma chave única acordada pela comunidade.

**Decisão pendente:** o projeto não tem CPF ou outro documento de identificação no modelo. Definir qual chave identifica uma pessoa antes de implementar unicidade global.

**Estado atual — Parcial:** ao adicionar visitante novo a um evento, o fluxo procura duplicação na lista de participantes por ID ou por e-mail preenchido. Isso não é uma restrição global: o formulário geral não valida duplicidade e não existe constraint de banco. A lista mockada de presença também pode conter repetições.

## 4. Cadastro e ciclo de vida de eventos

### 4.1 Campos e cadastro

**Regra proposta:** todo evento deverá ter nome, data, horário, local, responsável e situação.

**Estado atual:** o formulário de evento exige nome, data, horário e local; responsável recebe um valor padrão, mas não é validado como obrigatório no formulário. Evento novo e primeira ocorrência de uma série começam com status Confirmado e zero inscritos. Eventos podem ser avulsos ou vinculados a uma série.

### 4.2 Situações do evento

**Estado atual implementado na interface:** Confirmado, Em breve e Cancelado. O tipo TypeScript também contempla Concluído, mas o seletor atual não oferece essa opção.

**Regra proposta no segundo conjunto de regras:** Confirmado, Agendado, Em andamento, Encerrado e Cancelado. Eventos encerrados não poderão mais receber alterações de presença.

**Decisão pendente:** Confirmado e Cancelado coincidem nas duas listas. “Em breve” não será tratado automaticamente como “Agendado”, e “Concluído” não será tratado automaticamente como “Encerrado”. Definir a lista final de estados, as transições permitidas e qual estado bloqueia edição de presença. Até essa decisão, a interface atual permanece a referência.

### 4.3 Edição, duplicação e exclusão

**Estado atual:** a ação Editar na tabela apenas exibe feedback; não altera o evento. Duplicar cria uma cópia com novo ID, sufixo “(cópia)” e status Em breve, preservando os demais campos copiados. Excluir pede confirmação e remove o item da lista local.

**Regra proposta — A implementar:** alterações em evento devem ser editáveis por usuários autorizados. Nenhum registro histórico usado pelo sistema deve ser removido fisicamente; a exclusão deve ser lógica (soft delete), preservando referências e histórico.

**Decisão pendente:** definir se o soft delete se aplica a todos os tipos de registro, quais papéis podem solicitá-lo e como itens removidos aparecem em consultas e relatórios.

## 5. Séries recorrentes e exceções de data

### 5.1 Regras implementadas

1. Uma série contém nome, categoria, dia da semana, horário, local, responsável, capacidade, descrição e observações.
2. Ao criar a série, o protótipo cria o template e somente a primeira ocorrência no próximo dia configurado. Não agenda ocorrências futuras automaticamente.
3. Selecionar uma série no formulário de evento preenche os valores padrão; mudanças feitas nessa ocorrência não alteram o template.
4. A data deve coincidir com o dia da série, exceto quando **Alterar data apenas desta ocorrência** estiver marcado.
5. A exceção salva `scheduleException: true` e mantém `seriesId`, então continua ligada à série e identificada nos detalhes e relatórios.
6. Mudar a seleção de série redefine o marcador de exceção.

### 5.2 Evolução

**A implementar / decidir:** definir se o sistema gerará automaticamente ocorrências futuras e como será possível editar ou cancelar uma série inteira versus uma ocorrência específica. A exceção atual não tem justificativa, aprovação ou histórico de alteração.

## 6. Registro de presença

### 6.1 Estado atual

1. A presença é ajustada na lista de participantes dentro do detalhe do evento; não existe aba principal Presenças.
2. Membros podem ter um status por registro exibido entre Presente, Ausente e Justificado.
3. Participantes/visitantes não recebem status de presença; sua situação é mostrada como “—”.
4. Ao adicionar um membro a um evento, o registro local começa como Ausente. Visitantes começam sem status.
5. A interface de inclusão impede selecionar novamente uma pessoa que já aparece na lista daquela ocorrência, usando ID ou e-mail disponível.
6. Alterar presença não recalcula automaticamente percentual de frequência ou última visita.
7. Os registros são locais e a base mockada pode conter repetições; não há unicidade garantida por servidor.

### 6.2 Regra proposta e conflito

**Regra proposta:** uma pessoa poderá ter apenas um registro de presença por evento, com estados Presente ou Ausente. Não poderá existir registro duplicado para a mesma pessoa no mesmo evento.

**Decisão pendente:** o protótipo também permite Justificado. Confirmar se esse estado deve permanecer no produto final. A regra de unicidade deverá ser garantida no backend, além do filtro visual de inclusão.

### 6.3 Faltas

**Regra proposta:** somente membros possuem histórico de faltas; cada ausência fica vinculada ao evento correspondente. Participantes não possuem histórico de ausência.

**Estado atual:** o seletor permite marcar Ausente para membro e visitante não recebe status. Não há cálculo ou histórico confiável de faltas, pois os registros são mockados e não persistem.

## 7. QR Code

### 7.1 Convite para o grupo News

**Implementado:** há um QR estático que direciona ao link oficial do grupo WhatsApp News, centralizado em `lib/constants.ts`. A interface não aplica expiração nem troca o QR automaticamente. O convite continuará válido enquanto o link estiver ativo no WhatsApp. A imagem é obtida externamente por `api.qrserver.com`.

### 7.2 Ferramenta de QR de presença

**Estado atual — demonstrativo:** permanece uma ferramenta independente acessível pela paleta de comandos. Seu padrão é decorativo e não faz check-in; cronômetro, seleção de evento, histórico, download e contadores não integram com uma presença real.

**Regra proposta:** o sistema possuirá um único QR Code, exclusivamente para direcionar ao grupo oficial do WhatsApp. Ele não fará check-in, não registrará presença, não identificará pessoas, não terá validade nem mudará dinamicamente.

**Decisão de evolução:** a proposta corresponde ao QR do News já implementado. A ferramenta decorativa de QR de presença ainda existe no código; deve ser removida ou desativada quando o escopo final for aplicado.

## 8. Exclusão, histórico e auditoria

**Regras propostas — A implementar:**

- usar exclusão lógica para preservar registros referenciados e histórico;
- registrar alterações importantes, como cadastro, presença e responsável do evento;
- armazenar usuário responsável, data, horário e ação executada;
- permitir que administradores consultem a auditoria.

**Estado atual:** não existe soft delete, histórico de auditoria, usuário autenticado autor da mudança nem timestamp consistente por operação. Excluir evento remove-o do estado local.

## 9. Integridade dos dados

**Regras propostas — A implementar:** impedir eventos duplicados, cadastros duplicados, presenças duplicadas e inconsistência entre membro e participante.

**Estado atual:** IDs locais são gerados para novos eventos e alguns visitantes; isso não garante unicidade global. O formulário de inclusão no evento evita duplicar uma seleção na interface, mas os mocks e a ausência de backend impedem garantir integridade geral. Não há regra de CPF nem validação transversal de membro versus visitante.

## 10. Relatórios

**Implementado:** filtrar todos os eventos, uma série por `seriesId` ou ocorrência individual e período Dia, Mês, Semestre, Ano ou Desde o início. Exceções continuam consolidadas na série. Eventos Cancelados são excluídos das opções de ocorrência, indicadores, gráfico e tabela. Os valores são calculados a partir da quantidade local de inscritos `attendees`.

**Limitações:** números de origem são mockados; exportação apenas mostra notificação e não gera arquivo. Não há trilha para explicar ou auditar como uma métrica foi calculada.

## 11. Disponibilidade e consistência offline

**Regra proposta — A implementar:** o sistema deve permanecer disponível durante os eventos e não perder registros caso haja falha temporária de conexão.

**Estado atual:** não existe armazenamento offline, fila de sincronização ou API. Alterações em estado React podem se perder ao recarregar ou fechar a página. A disponibilidade e recuperação de dados dependem de uma futura arquitetura com persistência e sincronização.

## 12. Regras gerais consolidadas

### Implementadas ou parcialmente demonstradas

- Membros e visitantes são categorias distintas na lista de um evento.
- Somente membros recebem estado de presença; visitantes aparecem sem status.
- Séries recorrentes mantêm um dia padrão, e uma ocorrência pode ter exceção explícita sem perder o vínculo à série.
- Eventos cancelados não aparecem nos relatórios.
- O QR do News é estático e aponta ao convite configurado.
- Cadastros disponíveis são iniciados em telas internas; não existe auto cadastro público. O painel ainda não aplica autenticação ou autorização.

### A implementar conforme decisão de produto

- Dois perfis autenticados com permissões distintas.
- Controle de eventos em andamento/encerrados e bloqueio de alteração de presença após encerramento.
- Definição final dos status e manutenção ou remoção de Justificado.
- Unicidade global de pessoas e presença por evento.
- Soft delete, histórico e auditoria.
- Persistência, sincronização offline e recuperação após falha de conexão.
- Remoção da ferramenta decorativa de QR de presença, mantendo apenas o QR informativo do WhatsApp.

## 13. Decisões pendentes

1. O estado “Em breve” deverá ser renomeado para “Agendado” ou coexistirá com ele?
2. “Concluído” é o estado desejado para substituir “Encerrado”, ou são conceitos diferentes?
3. Quais transições de status serão permitidas e em qual situação a presença será bloqueada?
4. Justificado permanece como estado válido de presença?
5. CPF será adotado como identificador único ou a comunidade definirá outra chave?
6. A regra de soft delete se aplica a eventos, pessoas, organizadores e registros de presença?
7. Organizadores poderão somente registrar presença e consultar, ou também incluir pessoas em eventos?

Até essas decisões serem confirmadas, as divergências ficam documentadas como propostas futuras; o comportamento atual do código não é reinterpretado.
