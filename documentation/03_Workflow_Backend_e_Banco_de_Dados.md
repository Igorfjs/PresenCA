# Workflow de implementação — Backend e banco de dados

**Projeto:** PresenCA  
**Status:** Proposta de execução  
**Objetivo:** evoluir o protótipo para uma aplicação com API NestJS e PostgreSQL, mantendo desenvolvimento e produção isolados.

## Situação atual

- `apps/api` tem o bootstrap NestJS, validação de configuração, Swagger, health check, módulos vazios por domínio e um schema Prisma inicial.
- `compose.yaml` sobe web, API e PostgreSQL de desenvolvimento em containers separados.
- `compose.production.yaml` recebe uma conexão de produção externa; não deve ser usado para desenvolver.
- As telas ainda leem dados mockados. Não há migrações, seed, login funcional nem endpoints de negócio.

O schema atual é um rascunho inicial, não uma base pronta para receber dados reais. Devemos revisar as decisões abaixo antes de criar a primeira migração.

## Como trabalharemos

Cada etapa será concluída nesta ordem:

1. Confirmar as regras de negócio relacionadas à etapa.
2. Definir entidades, restrições e contratos da API.
3. Implementar no ambiente local de desenvolvimento.
4. Validar os fluxos e revisar dados de teste.
5. Integrar uma tela do frontend por vez, substituindo mocks por chamadas à API.
6. Atualizar a documentação e guardar a alteração em uma mudança revisável.

Produção só entra no fluxo depois que o modelo, as migrações e a integração forem revisados. Nunca usar a URL ou credenciais do banco de produção para desenvolver.

## Etapa 0 — Decisões registradas e pendências

As decisões abaixo foram registradas em `02_Regras_de_Negocio.md` e orientam o modelo:

- Status finais de evento: Confirmado, Agendado, Em andamento, Encerrado e Cancelado. Somente administradores podem alterar o status e podem selecionar qualquer estado a qualquer momento, inclusive reabrir um evento Encerrado. Enquanto Encerrado, presença fica bloqueada; depois de reaberto, volta a ser editável. Os rótulos antigos “Em breve” e “Concluído” serão normalizados para Agendado e Encerrado.
- Presença possui Presente, Ausente e Justificado.
- Não será coletado documento. Cada pessoa terá ID interno global e imutável, compartilhado entre missões; o nome não será chave relacional.
- Administradores e organizadores precisam corresponder a membros existentes.
- Uma pessoa/conta pode ter associação e papel diferentes em vários workspaces.
- Não haverá hierarquia global de superadministrador inicialmente. Uma pessoa com papel Administrador em cada workspace pode administrar todas as missões. Um papel global só será necessário para ações próprias da plataforma, como criar workspaces ou controlar configurações globais.
- Cada membro tem uma missão atual, atribuída automaticamente pelo workspace no cadastro e alterável por administrador. A missão determina a lista de membros em que aparece; papéis de acesso por workspace são independentes da missão.
- As missões são Goiânia, Belém, São Paulo e Membros externos. Cristo Alegria Brasil corresponde à quarta missão, Membros externos.
- A lista padrão é filtrada para a missão do workspace; diretório global pode ser consultado com filtro de missão.
- Todos os workspaces usam `America/Sao_Paulo`.
- Membros precisam de data de nascimento; para participantes é opcional. Armazenar como data sem horário.
- A aba Organizadores não terá coluna nem regra de status.
- Somente administradores podem excluir registros. Exclusões podem ser desfeitas por sete dias, exceto a de eventos, que não podem ser restaurados e são omitidos dos relatórios.
- Ao excluir uma pessoa, manter suas presenças e totais históricos, ocultar sua identidade e anonimizar seus dados pessoais após sete dias.
- Remover e adicionar novamente uma pessoa a uma ocorrência cria um novo registro de presença com novo ID, preservando o registro anterior.
- Nomes completos iguais são permitidos com confirmação administrativa e IDs globais distintos; nomes são armazenados em minúsculas com iniciais de cada palavra maiúsculas e nunca são usados para unir pessoas.

**Etapa 0 concluída:** as decisões de produto necessárias para iniciar a revisão do modelo foram respondidas e registradas em `02_Regras_de_Negocio.md`. A política de desfazer exclusões deve gerar também um evento de auditoria; eventos excluídos não podem ser restaurados.

## Etapa 1 — Revisar o modelo de dados

Revisar `apps/api/prisma/schema.prisma` e desenhar as relações antes da migração inicial. O modelo proposto contém:

- `Workspace`: missão/comunidade e fronteira de isolamento dos dados.
- `User`: credencial e identidade de acesso ao sistema.
- `WorkspaceMembership`: associa o usuário (que está ligado a um membro) ao workspace e define o papel nesse workspace. A conta deve pertencer a uma pessoa do tipo Membro, tanto para Administrador quanto para Organizador.
- `Person`: registro central com ID global, tipo Membro ou Visitante, nome normalizado e data de nascimento (obrigatória para membros e opcional para visitantes). Membros têm missão atual (Goiânia, Belém, São Paulo ou Membros externos); a missão não é a mesma coisa que o papel de acesso.
- `RecurringSeries` e `Event`: a série mantém os padrões configurados ao cadastrar o evento recorrente; cada ocorrência armazena os valores efetivos, incluindo possíveis exceções.
- `Attendance`: vínculo pessoa/evento. Pode haver linhas históricas removidas, mas apenas uma linha ativa por pessoa/ocorrência.
- `AuditLog`: ator, workspace, ação, entidade, data/hora, snapshot para desfazer e prazo de sete dias para restauração de dados pessoais.

O schema foi revisado como rascunho, sem migração. Antes da migração, revisar as restrições condicionais entre tipo, aniversário, missão e conta de usuário. IDs de pessoa são globais e permanecem iguais ao mudar de missão. O aniversário e a data de ingresso são datas sem horário; o aniversário é obrigatório para membros e opcional para visitantes. Nomes são normalizados ao salvar, mas nomes iguais continuam sendo pessoas distintas. Consultas de membros filtram por missão; relatórios históricos mantêm os totais das presenças de pessoas excluídas, ocultando a identidade, e omitem eventos apagados. A restauração dos dados pessoais expira em sete dias. O evento e a auditoria armazenam instantes com fuso; a interface exibe `America/Sao_Paulo`.

**Saída da etapa:** diagrama simples de entidades, schema revisado e restrições aprovadas.

## Etapa 2 — Criar a primeira migração e os dados de desenvolvimento

1. Manter `.env` e `apps/api/.env` locais, ignorados pelo Git, usando somente a base `presenca_development` do Compose.
2. Instalar dependências da API e gerar o cliente Prisma.
3. Validar o schema e criar a migração inicial com nome descritivo. Incluir índice único parcial para garantir uma presença ativa por pessoa/evento, permitindo novo registro depois de remover o anterior.
4. Aplicar a migração no PostgreSQL local.
5. Criar um seed repetível com workspaces, contas de desenvolvimento, membros, visitantes, séries, eventos e presenças fictícias.
6. Verificar que o seed pode ser reexecutado sem duplicar dados e sem incluir dados pessoais reais.

**Saída da etapa:** banco local recriável, migração versionada e seed para desenvolvimento. Não inserir dados mockados de interface automaticamente no banco sem revisar e normalizar o conteúdo.

## Etapa 3 — Implementar autenticação, workspace e autorização

Implementar login e sessão segura antes de abrir operações administrativas. Cada requisição autenticada deve resolver usuário e workspace ativo. A API precisa confirmar a associação e o papel no servidor; esconder botões no frontend não é controle de acesso.

Regras iniciais:

- Administrador gerencia cadastros, configurações, relatórios e papéis de acesso.
- Organizador executa operações permitidas e não altera papéis nem configurações administrativas.
- A atribuição de papel por workspace e a relação de todo administrador/organizador com um membro são validadas no serviço e registradas na auditoria.
- Consultas e mutações sempre filtram pelo workspace autorizado.

**Saída da etapa:** sessão funcional, proteção padrão das rotas e cenários de autorização documentados.

## Etapa 4 — Construir os módulos de negócio

Implementar e revisar um módulo por vez, seguindo a dependência dos dados:

1. **Pessoas e organizadores:** CRUD de membros/visitantes com aniversário e missão, diretório global filtrável, mudança de missão por administrador e concessão de papel a um membro existente. A tabela de organizadores não tem status.
2. **Eventos e recorrências:** séries, ocorrências, exceção de data, responsável, estados e cancelamento.
3. **Presenças:** adicionar pessoa à ocorrência, atualizar status, impedir duplicidade e bloquear edição conforme o estado final do evento.
4. **Relatórios:** consultas agregadas que excluem cancelados e respeitam workspace e filtros definidos.
5. **Configurações e auditoria:** dados da comunidade, preferências e histórico das ações autorizadas. Gravar a alteração e a auditoria na mesma transação; guardar o estado anterior necessário para desfazer exclusões durante sete dias e anonimizar os dados pessoais ao vencer o prazo. Exclusão de evento não pode ser desfeita.

Endpoints REST devem usar DTOs validados, respostas e erros consistentes, paginação para listas e documentação Swagger. Operações que alteram várias tabelas devem usar transação.

## Etapa 5 — Integrar o frontend progressivamente

Não substituir todos os mocks de uma vez. Começar por **Membros e Organizadores**, pois isso valida primeiro a regra de identidade e acesso; depois conectar Eventos, Presenças e Relatórios.

Para cada aba:

1. Definir contrato da API e os estados de carregamento, erro, vazio e sucesso.
2. Implementar chamadas pelo cliente de API em `apps/web/src/lib/api-client.ts` ou por serviços de domínio.
3. Trocar a fonte mockada mantendo o layout e o comportamento visual existentes.
4. Confirmar criação, edição, busca, filtros, permissões e atualização após recarregar.
5. Remover o mock daquela funcionalidade somente depois da integração revisada.

O seletor de workspace só deve passar a filtrar dados depois que a autorização e o escopo multi-workspace estiverem ativos na API.

## Etapa 6 — Preparar produção

- Criar banco PostgreSQL de produção separado e configurar segredos fora do Git.
- Aplicar migrações com `prisma migrate deploy` em um passo controlado do deploy.
- Manter backup e procedimento de restauração antes de alterações destrutivas.
- Subir primeiro em um ambiente de staging com cópia de dados fictícios.
- Verificar health check, logs, permissões, isolamento de workspaces e fluxos críticos.
- Só então publicar a versão aprovada.

## Critérios para avançar de etapa

- Regras relacionadas à etapa foram confirmadas e documentadas.
- O schema não depende de mocks nem de rótulos ambíguos da interface.
- Migrações executam em um banco vazio de desenvolvimento.
- Dados de seed são fictícios, previsíveis e reexecutáveis.
- A API aplica validação e autorização no servidor.
- A interface mostra estados de carregamento, erro e sucesso e não apresenta dados como salvos antes da resposta da API.
- Nenhuma etapa local usa credenciais, dados ou volumes de produção.

## Próximo passo recomendado

Revisar e aprovar o rascunho atualizado de `apps/api/prisma/schema.prisma`, conferindo relações, restrições condicionais e auditoria/desfazer. A Etapa 0 está concluída. Depois da aprovação e validação do schema, criar a migração inicial somente no PostgreSQL local de desenvolvimento.
