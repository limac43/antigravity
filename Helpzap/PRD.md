# Product Requirements Document (PRD) - Helpzap MVP

## 1. Introdução
O **Helpzap MVP** é uma ferramenta de assistência virtual projetada para otimizar e humanizar o atendimento realizado pelos analistas de suporte da ZG Soluções. Através do uso de Inteligência Artificial Generativa (Gemini 1.5 Flash), a aplicação analisa prints de conversas de WhatsApp e sugere respostas rápidas, assertivas e empáticas, classificando o atendimento em cenários predefinidos.

## 2. Objetivos
- **Reduzir o tempo de resposta:** Acelerar a formulação de respostas a mensagens comuns de clientes.
- **Padronizar e humanizar a comunicação:** Garantir que as respostas estejam alinhadas com a cultura e o glossário da ZG Soluções (ex: Zerinho, Triagem, Ticket/Chamado), porém com um tom mais humano e empático.
- **Diminuir o esforço cognitivo do analista:** Automatizar a classificação do contexto do chamado com base em imagens da conversa.
- **Garantir a conformidade de processos:** Aplicar checklists obrigatórios antes do envio de qualquer resposta.

## 3. Escopo e Funcionalidades Core (MVP)
### 3.1. Autenticação e Configuração
- Interface simples que permite ao usuário inserir a chave de API (API Key) do Gemini 1.5 Flash.
- Campo de senha para ocultar a chave digitada durante a utilização da tela.

### 3.2. Entrada de Dados (Paste Zone)
- Área dedicada onde o analista pode simplesmente colar (Ctrl+V) uma imagem (print screen) do WhatsApp.
- Visualização (preview) imediata da imagem inserida.

### 3.3. Processamento de IA
- Comunicação direta com a API do Gemini 1.5 Flash (utilizando `gemini-1.5-flash`).
- Análise de imagem combinada com um *System Prompt* rigoroso.
- **Classificação Automática** em um de 7 cenários:
  1. Chamado(s) priorizado(s)
  2. Chamado em atendimento
  3. Segunda cobrança
  4. Zerinho finalizou, cliente discorda
  5. Relato sem ticket aberto
  6. Cliente recusa abrir ticket
  7. Informação nova em ticket aberto

### 3.4. Saída de Dados e Resposta
- Geração de resposta contextualizada com o cenário identificado, mantendo espaços vazios `[ ]` para que o analista insira os dados específicos do cliente (nome, ticket, etc.).
- Botão "Copiar Resposta" para transferir a sugestão com um clique para a área de transferência.
- Inclusão obrigatória de um "Checklist de 30 segundos" visual no final da geração para controle de qualidade da ZG Soluções.

## 4. Requisitos Não Funcionais
- **Performance:** Processamento da imagem e retorno do texto devem ocorrer rapidamente (dependente do tempo de resposta da API do Google, mas com feedback visual de *loading*).
- **Interface e Usabilidade (UI/UX):**
  - Design moderno em "Dark Mode".
  - Fontes legíveis (Inter) e uso de ícones (Font Awesome).
  - Micro-interações e animações fluídas de feedback de clique e estados de carregamento.
- **Segurança e Privacidade:** Como o processamento ocorre via client-side (no navegador local do analista), nenhuma informação trafega para servidores próprios da aplicação (exclusivamente navegador <> Google API).

## 5. Casos de Uso
1. **O analista recebe um print do WhatsApp de um cliente impaciente que pede um status:**
   - O analista tira print da tela do WhatsApp, cola no Helpzap.
   - A IA identifica como "Segunda cobrança" (Cenário 3) ou "Chamado em atendimento" (Cenário 2).
   - O Helpzap gera um texto como: "Olá [Nome], vi que você mandou mensagem sobre o ticket [n° ticket]. A equipe já está analisando e eu retorno logo mais!".
   - O analista copia, preenche e envia ao cliente.

## 6. Próximos Passos (Evolução pós-MVP)
- Suporte a entrada de texto (transcrição do WhatsApp Web) em vez de apenas imagem.
- Integração nativa com sistema de chamados (Zendesk, Jira, etc.) para auto-preenchimento das tags.
- Histórico local de mensagens processadas.
- Possibilidade de salvar configurações de API de forma segura no *localStorage*.
