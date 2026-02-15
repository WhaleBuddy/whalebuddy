# Discord Channel Registration Endpoint

## Overview

This document describes the Discord channel registration endpoint that allows users to select and register a Discord channel for integration with Whalebuddy.

## Endpoint Details

### Route

`discord.registerChannel` (tRPC mutation)

### Location

`/root/whalebuddy/src/server/api/routers/discord.ts`

### Authentication

Protected procedure - requires user authentication

## Input Schema

```typescript
{
  channelId: string;     // Required: Discord channel ID (minimum 1 character)
  channelName?: string;  // Optional: Channel name for display purposes
}
```

## Validations

The endpoint performs the following validations in order:

### 1. Channel Exists

- **What**: Verifies the channel exists in Discord
- **How**: Fetches channel data from Discord API
- **Error**: "Channel not found or bot doesn't have access"

### 2. Belongs to Expected Server

- **What**: Validates the channel belongs to the configured Discord server
- **How**: Compares `channel.guild_id` with `DISCORD_GUILD_ID` environment variable
- **Error**: "Channel does not belong to the configured Discord server"

### 3. Is a Text Channel

- **What**: Ensures the selected channel is a text channel
- **How**: Checks if `channel.type === 0` (GUILD_TEXT)
- **Error**: "Selected channel must be a text channel. Please select a text channel."

### 4. Bot Has Send Permissions

- **What**: Verifies the bot can send messages to the channel
- **How**: Sends a test message to the channel
- **Error**: "Bot doesn't have permission to send messages in this channel"

## Response

### Success Response

```typescript
{
  success: true;
  message: "Discord channel registered successfully" |
    "Discord channel updated successfully";
  integration: {
    channelId: string;
    channelName: string;
    status: "completed";
  }
}
```

### Error Response

Throws a tRPC error with descriptive message. The integration status is set to "error" in the database.

## Database Operations

### New Integration

Creates a new record in `discord_integrations` table with:

- `userId`: Current authenticated user ID
- `channelId`: Selected channel ID
- `channelName`: Channel name (from input or fetched from Discord)
- `guildId`: Discord server ID
- `status`: "completed"
- `createdAt`: Current timestamp

### Existing Integration (Update)

Updates the existing record with:

- `channelId`: New channel ID
- `channelName`: New channel name
- `guildId`: Discord server ID
- `status`: "completed"
- `updatedAt`: Current timestamp

**No duplication**: The endpoint checks for existing integration and updates it instead of creating a duplicate.

## Acceptance Criteria Status

✅ **Channel selected is saved correctly**

- Channel data is persisted in the `discord_integrations` table

✅ **Integration status indicates connection completed**

- Status field is set to "completed" upon successful registration

✅ **Changing channel is possible without duplication**

- Existing integration is updated instead of creating new records

✅ **UI can trigger this action and advance the flow**

- Frontend component (`discord-integration.tsx`) successfully calls the mutation
- UI updates after successful registration
- User receives feedback on success/error

## Frontend Integration

### Component

`/root/whalebuddy/src/components/discord-integration.tsx`

### Usage Example

```typescript
const registerChannel = api.discord.registerChannel.useMutation({
  onSuccess: () => {
    void refetchIntegration();
    alert("Discord channel registered successfully!");
  },
  onError: (error) => {
    alert(`Error: ${error.message}`);
  },
});

// Call the mutation
registerChannel.mutate({
  channelId: selectedChannelId,
  channelName: selectedChannel?.name,
});
```

## Environment Variables Required

- `DISCORD_BOT_TOKEN`: Discord bot authentication token
- `DISCORD_GUILD_ID`: The Discord server ID where channels should be registered

## Test Message

Upon successful validation, the bot sends a test message to the channel:

```
✅ Whalebuddy integration configured successfully!
```

This confirms:

1. The bot has access to the channel
2. The bot has permission to send messages
3. The integration is working correctly

## Error Handling

All errors are caught and handled gracefully:

1. Validation errors throw descriptive messages
2. Integration status is set to "error" in database
3. Frontend receives error message for user feedback

## Flow Diagram

```
User selects channel
       ↓
Validate channel exists
       ↓
Validate belongs to server
       ↓
Validate is text channel
       ↓
Validate bot permissions
       ↓
Send test message
       ↓
Check for existing integration
       ↓
Update or Create record
       ↓
Set status to "completed"
       ↓
Return success response
```

## Related Files

- **Router**: `/root/whalebuddy/src/server/api/routers/discord.ts`
- **Schema**: `/root/whalebuddy/src/server/db/schema.ts`
- **Component**: `/root/whalebuddy/src/components/discord-integration.tsx`
- **Environment**: `/root/whalebuddy/src/env.js`
