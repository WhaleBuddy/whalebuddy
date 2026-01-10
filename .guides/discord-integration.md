# Discord Integration - Endpoint de Registro de Canal

## Visão Geral

Este documento descreve o endpoint `registerChannel` que permite aos usuários registrar um canal Discord selecionado para receber notificações do WhaleBuddy.

## Endpoint

### `discord.registerChannel`

**Tipo:** Mutation (tRPC)  
**Autenticação:** Requerida (protectedProcedure)

#### Input

```typescript
{
  channelId: string; // ID do canal Discord (mínimo 1 caractere)
  channelName: string; // Nome do canal Discord (mínimo 1 caractere)
}
```

#### Output

```typescript
{
  success: boolean;
  message: string;
  channelId: string;
  channelName: string;
}
```

## Validações Implementadas

O endpoint realiza as seguintes validações antes de registrar o canal:

### 1. Existência do Canal

- Verifica se o canal existe no Discord através da API
- **Erro:** `NOT_FOUND` - "Canal não encontrado no Discord"

### 2. Pertencimento ao Servidor

- Valida se o canal pertence ao servidor configurado (`DISCORD_GUILD_ID`)
- **Erro:** `BAD_REQUEST` - "Este canal não pertence ao servidor esperado"

### 3. Tipo de Canal

- Confirma que é um canal de texto (type === 0)
- **Erro:** `BAD_REQUEST` - "Apenas canais de texto são suportados"

### 4. Permissões do Bot

- Verifica se o bot tem as seguintes permissões no canal:
  - `VIEW_CHANNEL` (0x0000000000000400)
  - `SEND_MESSAGES` (0x0000000000000800)
- **Erro:** `FORBIDDEN` - "O bot não tem permissão para enviar mensagens neste canal"

## Comportamento

### Primeira Integração

Se o usuário não possui uma integração existente:

- Cria um novo registro na tabela `whalebuddy_discord_integration`
- Define `isActive` como `true`
- Registra a data de conexão em `connectedAt`

### Atualização de Canal

Se o usuário já possui uma integração:

- Atualiza o `channelId` e `channelName`
- Mantém o `userId` e `guildId`
- Atualiza `updatedAt` com a data atual
- Reativa a integração (`isActive = true`)

**Importante:** Não há duplicação de registros. O sistema usa `userId` como chave única.

## Estrutura do Banco de Dados

### Tabela: `whalebuddy_discord_integration`

```sql
CREATE TABLE whalebuddy_discord_integration (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL UNIQUE REFERENCES whalebuddy_user(id) ON DELETE CASCADE,
  guild_id VARCHAR(255) NOT NULL,
  channel_id VARCHAR(255) NOT NULL,
  channel_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX discord_user_id_idx ON whalebuddy_discord_integration(user_id);
CREATE INDEX discord_channel_id_idx ON whalebuddy_discord_integration(channel_id);
```

## Outros Endpoints Disponíveis

### `discord.getIntegration`

**Tipo:** Query  
**Descrição:** Retorna a integração Discord do usuário autenticado  
**Output:** `DiscordIntegration | null`

### `discord.listChannels`

**Tipo:** Query  
**Descrição:** Lista todos os canais de texto do servidor Discord configurado  
**Output:** `Array<{ id, name, guildId, guildName }>`

### `discord.sendTestMessage`

**Tipo:** Mutation  
**Descrição:** Envia uma mensagem de teste para o canal configurado  
**Output:** `{ success: boolean, message: string }`

### `discord.disconnectIntegration`

**Tipo:** Mutation  
**Descrição:** Desativa a integração (marca `isActive` como `false`)  
**Output:** `{ success: boolean, message: string }`

## Exemplo de Uso (Frontend)

```typescript
"use client";

import { api } from "~/trpc/react";

export function DiscordSetup() {
  const registerChannel = api.discord.registerChannel.useMutation({
    onSuccess: (data) => {
      console.log("Canal registrado:", data.channelName);
    },
    onError: (error) => {
      console.error("Erro:", error.message);
    },
  });

  const handleRegister = () => {
    registerChannel.mutate({
      channelId: "1234567890",
      channelName: "general",
    });
  };

  return (
    <button onClick={handleRegister}>
      Registrar Canal
    </button>
  );
}
```

## Variáveis de Ambiente Necessárias

```bash
# Token do bot Discord
DISCORD_BOT_TOKEN="your_bot_token_here"

# ID do servidor Discord
DISCORD_GUILD_ID="your_guild_id_here"

# URL da API do Discord
DISCORD_API_URL="https://discord.com/api/v10"
```

## Configuração do Bot Discord

1. Acesse o [Discord Developer Portal](https://discord.com/developers/applications)
2. Crie uma nova aplicação ou selecione uma existente
3. Vá para a seção "Bot" e crie um bot
4. Copie o token do bot para `DISCORD_BOT_TOKEN`
5. Ative os seguintes Privileged Gateway Intents:
   - Server Members Intent
   - Message Content Intent
6. Convide o bot para seu servidor com as permissões:
   - View Channels
   - Send Messages
7. Copie o ID do servidor (ative Developer Mode nas configurações do Discord)

## Fluxo da UI

1. **Usuário acessa** `/integration/discord`
2. **Sistema lista** canais disponíveis via `listChannels`
3. **Usuário seleciona** um canal da lista
4. **Usuário clica** em "Registrar Canal"
5. **Sistema valida** e registra via `registerChannel`
6. **UI atualiza** mostrando integração ativa
7. **Usuário pode** enviar mensagem de teste via `sendTestMessage`

## Critérios de Aceitação ✅

- [x] Canal selecionado é salvo corretamente
- [x] Estado da integração passa a indicar conexão concluída (`isActive = true`)
- [x] Alterar o canal é possível sem duplicação (update em vez de insert)
- [x] A UI consegue acionar essa ação e avançar no fluxo
- [x] Validação de existência do canal
- [x] Validação de pertencimento ao servidor
- [x] Validação de permissões do bot

## Tratamento de Erros

Todos os erros são retornados como `TRPCError` com códigos apropriados:

- `NOT_FOUND`: Canal não encontrado
- `BAD_REQUEST`: Canal inválido ou não pertence ao servidor
- `FORBIDDEN`: Bot sem permissões necessárias
- `INTERNAL_SERVER_ERROR`: Erros de API ou banco de dados

## Próximos Passos

Para usar a integração em produção:

1. Configure as variáveis de ambiente no `.env`
2. Execute `npm run db:push` para aplicar o schema
3. Acesse `/integration/discord` para configurar
4. Teste com `sendTestMessage`
5. Implemente a lógica de envio de notificações reais
