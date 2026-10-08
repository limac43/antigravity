# Helpzap

Assistente de respostas para atendimento da ZG Soluções.

## Executar localmente
Requer Python 3 e, para o comando abaixo, npm. Na pasta Helpzap:

```sh
npm start
```

Acesse http://127.0.0.1:4173/helpzap_mvp.html . Para encerrar, Ctrl+C no terminal do servidor. Se a porta estiver ocupada pelo servidor já iniciado, use a URL existente.

A interface pode ser visualizada sem chave. Para gerar respostas, configure uma chave Gemini em Configurações. O navegador envia o contexto ao Google e armazena a chave localmente. Fontes, ícones e SDK dependem de internet. Não há backend.

Consulte MELHORIAS.md para o diagnóstico e prioridades. O comando npm test ainda não tem uma suíte implementada.
