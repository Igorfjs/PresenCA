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

O repositório agora contém uma base de API NestJS e um schema inicial Prisma/PostgreSQL, mas ainda não implementa operações de negócio, autenticação, autorização ou persistência das telas. O painel continua usando dados mockados. A palavra “deverá” nas regras **A implementar** descreve o produto desejado, não uma capacidade já disponível.

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

**Estado atual — Parcial / demonstrativo:** o painel contém formulários e telas destinadas à equipe. Não há login real, verificação de perfil ou persistência. O formulário de participante altera uma lista React local; a tela de organizadores permite vincular um membro a um dos dois papéis, mas essa alteração existe somente no estado da sessão.

### 2.2 Organizador

**Regra proposta — A implementar:** o organizador terá acesso operacional para visualizar eventos, registrar presença e consultar membros e participantes. Não poderá:

- excluir usuários ou eventos;
- alterar configurações do sistema;
- alterar permissões.

**Regra adicional:** todo organizador deve corresponder a um membro já cadastrado. A concessão de acesso seleciona esse membro; não cria uma segunda pessoa. Um membro pode estar vinculado a apenas uma conta/papel de acesso por workspace.

**Estado atual — Parcial / demonstrativo:** os organizadores mockados estão vinculados a membros por `memberId`. Ao adicionar, a interface oferece apenas membros ainda sem acesso e associa os dados da pessoa ao registro local. Os papéis disponíveis são Administrador e Organizador. A tela de acesso negado não verifica o perfil autenticado e a permissão não protege telas nem controla ações.

### 2.3 Autenticação e acesso

**Regra proposta — A implementar:** somente usuários autenticados poderão acessar o painel e cada ação deverá respeitar o perfil e a permissão associados ao usuário. Somente um administrador poderá alterar os papéis de acesso de outros usuários.

**Estado atual:** `/login` não valida credenciais e redireciona para o painel. A API ainda não implementa autenticação, middleware ou sessão, portanto não existe restrição técnica ao painel. A permissão atribuída na inclusão não pode ser alterada depois pela interface; a ação contextual apenas exibe o papel atual.

### 2.4 Workspaces, papéis e missão

**Regras acordadas para a implementação:**

- A pessoa e sua conta são identidades centrais; permissões pertencem à associação do usuário com cada workspace.
- Cada pessoa tem um ID global imutável, que permanece o mesmo ao mudar de missão. Um ID nunca pode pertencer a duas pessoas.
- Um usuário pode ter papéis diferentes em workspaces diferentes. Ser administrador em todas as missões significa ter papel Administrador em cada workspace correspondente.
- Administradores e organizadores precisam estar associados a um membro existente. Conceder outro papel reutiliza a mesma pessoa; não cria cadastro duplicado.
- Não será criada uma hierarquia global de superadministrador neste momento. Ela só será necessária se houver ações exclusivas que atravessem todos os workspaces, como criar workspaces ou administrar configurações globais da plataforma.
- Cada membro possui uma missão atual. Ao cadastrá-lo, a missão é definida automaticamente a partir do workspace ativo. Um administrador pode alterar a missão; a alteração atualiza as listas em que o membro aparece, sem mover nem reescrever o histórico dos eventos anteriores.
- As missões são Goiânia, Belém, São Paulo e Membros externos. Cristo Alegria Brasil corresponde à missão Membros externos.
- A lista padrão de membros mostra somente pessoas cuja missão corresponde ao workspace ativo. A equipe pode consultar o diretório geral e filtrar por missão para localizar membros de outras unidades e conceder acesso.
- O papel de acesso ao workspace e a missão do membro são conceitos distintos. Ter papel em um workspace não altera a missão atribuída à pessoa.
- Membros precisam ter data de nascimento; para participantes o campo é opcional. Armazenar como data civil, sem horário.
- O fuso horário dos workspaces é `America/Sao_Paulo`.
- A aba Organizadores não exibe nem mantém status próprio.

**Estado atual:** o seletor de workspace ainda é apenas visual; não existe diretório global de membros, campo de missão, data de nascimento obrigatória ou papel persistido por workspace. A tabela de organizadores ainda mostra um status demonstrativo até a interface ser atualizada.

**Recomendação para o modelo:** manter `Person` como registro único global e associar a conta de acesso a essa pessoa. `WorkspaceMembership` concede papéis por workspace; uma pessoa pode ter várias associações de acesso, uma por workspace, sem duplicar os dados pessoais. A missão é um atributo do membro, não do papel de acesso; participantes não recebem missão automaticamente.

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

### 3.3 Data de nascimento

**Regra acordada — A implementar:** membro deve ter data de nascimento no cadastro; para participante é opcional. O campo é uma data, sem horário, e não deve ser confundido com a data de ingresso na comunidade.

**Estado atual:** os formulários de membro e visitante ainda não coletam data de nascimento. O schema Prisma rascunho já possui `birthDate` como data opcional; a API deverá exigir o campo quando `type` for Membro.

### 3.4 Identificação única e duplicidades

**Regra acordada:** não será coletado documento. Cada pessoa terá um ID interno imutável e global, que permanece igual entre missões e nunca poderá identificar outra pessoa. O nome completo é usado para localizar a pessoa, não como chave do banco.

**Regra acordada — A implementar:** permitir pessoas diferentes com o mesmo nome completo. Ao detectar um possível homônimo, pedir confirmação administrativa antes de concluir o cadastro. Cada pessoa terá ID interno distinto e o sistema nunca deve unir cadastros automaticamente pelo nome. Armazenar nomes em minúsculas, com a primeira letra de cada palavra em maiúscula; a normalização deve ocorrer ao salvar e não deve fundir registros homônimos.

**Estado atual — Parcial:** ao adicionar visitante novo a um evento, o fluxo procura duplicação na lista de participantes por ID ou por e-mail preenchido. Isso não é uma restrição global: o formulário geral não valida duplicidade e não existe constraint de banco. A lista mockada de presença também pode conter repetições.

## 4. Cadastro e ciclo de vida de eventos

### 4.1 Campos e cadastro

**Regra proposta:** todo evento deverá ter nome, data, horário, local, responsável e situação.

**Estado atual:** o formulário de evento exige nome, data, horário e local; responsável recebe um valor padrão, mas não é validado como obrigatório no formulário. Evento novo e primeira ocorrência de uma série começam com status Confirmado e zero inscritos. Eventos podem ser avulsos ou vinculados a uma série.

### 4.2 Situações do evento

**Estado atual implementado na interface:** Confirmado, Em breve e Cancelado. O tipo TypeScript também contempla Concluído, mas o seletor atual não oferece essa opção.

**Regra acordada:** Confirmado, Agendado, Em andamento, Encerrado e Cancelado. Somente administradores podem alterar o status; podem selecionar qualquer status a qualquer momento, inclusive reabrir um evento Encerrado. Enquanto estiver Encerrado, o evento não aceita alterações de presença; a presença volta a ser editável quando um administrador muda o status. O rótulo antigo “Em breve” será normalizado para “Agendado”; “Concluído” será normalizado para “Encerrado”.

**Implementação futura:** “Em andamento” ainda não está disponível. A interface e o schema precisam ser atualizados antes da migração inicial. A API deve validar que somente administradores alterem o status.

### 4.3 Edição, duplicação e exclusão

**Estado atual:** a ação Editar na tabela apenas exibe feedback; não altera o evento. Duplicar cria uma cópia com novo ID, sufixo “(cópia)” e status Em breve, preservando os demais campos copiados. Excluir pede confirmação e remove o item da lista local.

**Regra acordada — A implementar:** somente administradores podem excluir registros. Exclusões podem ser desfeitas pela auditoria durante sete dias; a ação **Desfazer** gera um novo registro de auditoria. Depois desse prazo, dados pessoais da pessoa excluída são anonimizados e não podem ser recuperados. Eventos são a exceção desde o momento da exclusão: não podem ser restaurados, apenas recriados.

**Regra acordada — A implementar:** excluir uma pessoa da lista de membros ou participantes não apaga nem altera as estatísticas das presenças anteriores. Durante sete dias a identidade pode ser restaurada; após isso, seus dados identificáveis são anonimizados, mas as presenças continuam compondo os totais históricos sem revelar quem era a pessoa. Evento excluído é removido dos relatórios; para voltar a utilizá-lo, deve ser recriado com novo ID.

## 5. Séries recorrentes e exceções de data

### 5.1 Regras implementadas

1. Uma série contém valores padrão de nome, categoria, dia da semana, horário, local, responsável, capacidade, descrição e observações, definidos ao cadastrar o evento recorrente.
2. Ao criar a série, o protótipo cria o template e somente a primeira ocorrência no próximo dia configurado. Não agenda ocorrências futuras automaticamente.
3. Selecionar uma série no formulário de evento preenche os valores padrão. Cada ocorrência guarda seus próprios valores efetivos; alterações nela não alteram o template da série.
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

### 6.2 Regra acordada

**Regra acordada:** uma pessoa poderá ter apenas um registro ativo de presença por ocorrência, com estados Presente, Ausente ou Justificado. Se a participação for removida e a pessoa for adicionada novamente, será criado um novo registro com ID próprio; o registro anterior permanece no histórico.

**Implementação futura:** a regra de unicidade ativa deverá ser garantida na API e por índice único parcial no PostgreSQL, além do filtro visual de inclusão. Para eventos recorrentes, cada ocorrência tem seus próprios registros de presença.

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

**Regras acordadas — A implementar:**

- somente administradores podem excluir registros; exclusões reversíveis podem ser desfeitas pela auditoria por até sete dias, exceto a de eventos;
- após sete dias, remover os dados identificáveis da pessoa excluída e expirar os dados pessoais guardados para restauração;
- manter nos totais históricos as presenças de pessoas excluídas, ocultando a identidade durante e após a janela de restauração;
- excluir eventos apagados dos relatórios; um evento precisa ser recriado, não restaurado;
- quando uma presença individual for excluída, ela deixa de compor as estatísticas enquanto estiver excluída; se desfeita dentro do prazo, volta a contar;
- registrar alterações importantes, como cadastro, presença e responsável do evento;
- armazenar usuário responsável, data, horário e ação executada;
- permitir que administradores consultem a auditoria.

**Estado atual:** não existe soft delete, histórico de auditoria, usuário autenticado autor da mudança nem timestamp consistente por operação. Excluir evento remove-o do estado local.

## 9. Integridade dos dados

**Regras acordadas — A implementar:** impedir mais de uma presença ativa por pessoa/ocorrência e manter uma identidade central de pessoa entre workspaces. Ao adicionar novamente uma pessoa após remoção, criar novo registro de presença, sem alterar o anterior. Não haverá CPF ou outro documento. O nome completo será usado para identificação humana; registros relacionais usarão um ID global imutável. Nomes iguais não devem causar junção automática de pessoas.

**Estado atual:** o schema Prisma rascunho foi atualizado para usar um ID global por pessoa, missão e aniversário, sem documento. Ainda não existem migrações nem operações da API para garantir unicidade, confirmar homônimos ou normalizar os nomes. O formulário de inclusão no evento evita duplicar uma seleção na interface, mas os mocks não garantem integridade geral.

## 10. Relatórios

**Implementado:** filtrar todos os eventos, uma série por `seriesId` ou ocorrência individual e período Dia, Mês, Semestre, Ano ou Desde o início. Exceções continuam consolidadas na série. Eventos Cancelados são excluídos das opções de ocorrência, indicadores, gráfico e tabela. Os valores são calculados a partir da quantidade local de inscritos `attendees`.

**Regra acordada — A implementar:** eventos excluídos também são omitidos dos relatórios. Excluir uma pessoa não remove suas presenças nem altera os totais históricos; os dados exibidos devem ocultar sua identidade.

**Limitações:** números de origem são mockados; exportação apenas mostra notificação e não gera arquivo. Não há trilha para explicar ou auditar como uma métrica foi calculada.

## 11. Disponibilidade e consistência offline

**Regra proposta — A implementar:** o sistema deve permanecer disponível durante os eventos e não perder registros caso haja falha temporária de conexão.

**Estado atual:** não existe armazenamento offline, fila de sincronização ou API de negócio integrada às telas. A API tem somente um health check nesta etapa. Alterações em estado React podem se perder ao recarregar ou fechar a página. A disponibilidade e recuperação de dados dependem da implementação de persistência e sincronização.

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
- Status Confirmado, Agendado, Em andamento, Encerrado e Cancelado; somente administradores alteram status, e Encerrado bloqueia presença até ser reaberto.
- Presenças Presente, Ausente e Justificado.
- Pessoa central com missão atual, diretório cross-workspace filtrável e papel de acesso independente em cada workspace.
- Data de nascimento obrigatória para membros e opcional para participantes.
- Fuso horário `America/Sao_Paulo` em todos os workspaces.
- Exclusão restrita a administradores; desfazer em até sete dias, exceto eventos.
- Anonimização de pessoa após o prazo sem remover totais históricos; eventos excluídos não entram em relatórios.
- Histórico e auditoria das alterações.
- Persistência, sincronização offline e recuperação após falha de conexão.
- Remoção da ferramenta decorativa de QR de presença, mantendo apenas o QR informativo do WhatsApp.

## 13. Decisões pendentes

As decisões da Etapa 0 sobre status de evento, exclusões, workspace Brasil, homônimos e efeitos da exclusão de pessoas em relatórios foram respondidas e estão registradas neste documento. Outras decisões de produto para etapas posteriores permanecem listadas no PRD.
