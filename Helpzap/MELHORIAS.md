# Helpzap — plano de evolução

## Estado atual
MVP em um único HTML, com estilos, templates e JavaScript embutidos. O navegador acessa o Gemini diretamente. Histórico guarda contagens por dia, não as mensagens. Não existe backend ou autenticação de usuários. O script npm test ainda é um placeholder.

## Correções aplicadas
- Contexto da última geração e referência do modal movidos para o escopo do módulo: antes a geração acessava uma variável local de outra função e falhava.
- Fechamento do modal registrado uma única vez; Escape também fecha.
- Texto gerado e mensagens de erro escapados antes de inserção como HTML.
- Percentual de precisão sem validação substituído por orientação de revisão humana.
- Falha de cópia passa a exibir orientação.
- Comando npm start para execução local.

## Prioridade 1 — geração confiável
- Unificar o modelo de teste, geração e regeneração em uma configuração; atualmente existem caminhos e listas diferentes. Verificar disponibilidade na conta antes de escolher o modelo.
- Validar o JSON e os três tons antes de registrar sucesso no histórico.
- Tratar separadamente autenticação, limite de uso, indisponibilidade e falha de rede; não classificar todos como chave inválida.
- Adicionar timeout, prevenção de cliques duplicados e testes de regressão com API simulada.
- Corrigir o campo context, rotulado Operadora, que não é lido na montagem do prompt.

## Prioridade 2 — experiência do analista
- Modo demonstração com templates locais e identificação clara de que não usa IA.
- Permitir editar a resposta antes de copiar e preservar o texto anterior quando a regeneração falhar.
- Explicar junto ao botão quais campos faltam para gerar.
- Melhorar navegação por teclado, foco do modal, labels e experiência em telas pequenas.
- Informar que tempo economizado é uma estimativa de cinco minutos por geração, não uma medição.

## Prioridade 3 — estrutura para equipe
- Separar estilos, componentes, templates e integração de IA em módulos.
- Fixar a versão do SDK: a página usa @latest via CDN, independentemente do package-lock local.
- Migrar a chave para um backend antes de disponibilizar para uma equipe; localStorage não é armazenamento seguro de segredo.
- Definir minimização de dados enviados ao provedor e retenção do histórico.
- Avaliar login, perfis, templates compartilhados e integração com chamados após estabilizar o fluxo principal.

## Critérios de aceite da próxima etapa
Gerar os três tons, copiar, fechar e reabrir o modal, regenerar uma opção sem perder o contexto, informar falha de rede e de quota corretamente, e preservar texto literal quando a IA devolver marcação HTML. Testar com dados fictícios.
