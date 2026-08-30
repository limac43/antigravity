# Product Requirements Document (PRD) - Helpzap MVP (Manual Command)

## 1. Introdução
O **Helpzap MVP** é uma ferramenta de assistência projetada para otimizar, humanizar e padronizar o atendimento realizado pelos analistas de suporte da ZG Soluções. Através do uso de Inteligência Artificial Generativa, a aplicação permite que o analista insira os dados do contexto de um chamado, selecionando áreas e cenários pré-definidos. A IA então recebe uma estrutura textual base e sugere respostas rápidas e empáticas em três tons diferentes (Formal, Direto e Acolhedor).

## 2. Objetivos
- **Reduzir o tempo de resposta:** Acelerar a formulação de respostas a mensagens comuns de clientes, com templates embutidos.
- **Padronizar e humanizar a comunicação:** Garantir que as respostas estejam alinhadas com a cultura e o glossário da ZG Soluções (ex: Zerinho, Triagem, Ticket/Chamado), permitindo variação de tom conforme a situação.
- **Facilitar o preenchimento de variáveis:** Campos estruturados para que o analista informe ID do Ticket, Nome do Cliente, Nome do Contato e Contexto.
- **Apoiar o Analista com Insights e Documentação:** Prover um histórico de uso, métricas de produtividade (Insights) e acesso rápido aos guias de comunicação padrão da ZG (Docs).

## 3. Escopo e Funcionalidades Core (MVP)
### 3.1. Autenticação e Configuração
- Interface que permite ao usuário inserir a chave de API (API Key) do Gemini, armazenada localmente de forma segura (localStorage).

### 3.2. Entrada de Dados (Formulário de Contexto)
- Seleção de **Área** (ex: Operadoras, Núcleos) e **Serviço**.
- Seleção de **Cenário**, entre 9 opções principais:
  1. Chamado(s) priorizado(s)
  2. Chamado em atendimento
  3. Segunda cobrança
  4. Zerinho finalizou, cliente discorda
  5. Relato sem ticket aberto
  6. Cliente recusa abrir ticket
  7. Informação nova em ticket aberto (Mensagem Interna)
  8. Solicitação de contato telefônico
  9. Instabilidade sistêmica (Incidente)
- Campos dinâmicos baseados no cenário escolhido (ex: input para "Ticket ID", "Nome do Cliente", "Nome do Contato", "Contexto").

### 3.3. Processamento de IA
- Geração de uma *estrutura de texto base* unindo os dados do formulário com um banco de frases predefinidas e regras lógicas.
- Comunicação direta com a API do modelo LLM do Google (Gemini).
- A IA atua como uma refinadora, reescrevendo o texto base de forma natural, premium e humanizada e entregando o conteúdo ajustado nas devidas tags [Ticket] e [Nome].

### 3.4. Saída de Dados e Resposta
- Exibição de resultados apresentando **3 opções de tom**:
  - Opção 1: Formal
  - Opção 2: Direto
  - Opção 3: Acolhedor
- Botões interativos "Copiar" para transferir a sugestão para a área de transferência do usuário, facilitando o colar no WhatsApp ou Zendesk.

### 3.5. Ferramentas Acessórias (Modais)
- **Histórico de Produtividade:** Acompanha quantos tickets o analista gerou por dia e permite auditoria própria de rendimento.
- **Insights:** Visualização do número total de respostas geradas, atuando de forma gamificada e estimulando o uso contínuo.
- **Docs:** Uma biblioteca rápida de consulta para base de conhecimento, scripts, e recomendações de discurso interno (como lidar com priorizações, cobranças, etc).

## 4. Requisitos Não Funcionais
- **Performance:** A construção do texto base é imediata (client-side), com a reformulação textual via IA executada de maneira síncrona com feedback visual (loading spinner e overlay).
- **Interface e Usabilidade (UI/UX):**
  - Design moderno e responsivo em "Dark Mode", estruturado em layout de duas colunas principais (Formulário de Contexto à esquerda e Output à direita).
  - Fontes modernas (Inter) e uso de ícones (Font Awesome) para maior clareza visual.
  - Validação de preenchimento (bloqueio do botão de "Gerar Resposta" até que todos os campos obrigatórios estejam validados).
- **Segurança e Privacidade:** O processamento ocorre via client-side no navegador local do analista.

## 5. Casos de Uso
1. **O analista precisa responder a uma cobrança sobre instabilidade:**
   - O analista abre o Helpzap.
   - Preenche a Área e Serviço. Seleciona o Cenário "Instabilidade sistêmica".
   - Digita o ID do Ticket, Nome do Cliente e o contexto do problema enfrentado.
   - Clica em "Gerar Resposta". O sistema monta a frase base e realiza a chamada da API da IA para refino de tom.
   - A IA retorna a mensagem nos tons Formal, Direto e Acolhedor. O analista escolhe o tom "Direto", copia com um clique e envia pelo comunicador oficial (WhatsApp/Zendesk).

## 6. Próximos Passos (Evolução pós-MVP)
- Expansão de novos cenários, áreas e serviços dinâmicos.
- Edição das frases de template localmente pelo próprio usuário.
- Sincronização em nuvem do histórico de produtividade.
- Integração nativa com sistema de chamados (Zendesk, Jira, etc.) para auto-preenchimento das tags.
