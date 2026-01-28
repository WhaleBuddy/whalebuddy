# Discord Channel Registration Endpoint

## Overview

This feature provides a complete Discord integration system that allows users to register a Discord channel for receiving notifications. The endpoint validates channel existence, guild ownership, and bot permissions before completing the registration.

## Features

- ✅ **Channel Registration**: Register a Discord channel for notifications
- ✅ **Validation**: Comprehensive validation of channel, guild, and permissions
- ✅ **Update Support**: Change channels without creating duplicates
- ✅ **Status Tracking**: Track integration status (pending, completed, error)
- ✅ **Permission Verification**: Automatically verify bot can send messages
- ✅ **Test Message**: Send confirmation message upon successful registration

## Database Schema

### `discord_integration` Table

| Column        | Type         | Description                                            |
| ------------- | ------------ | ------------------------------------------------------ |
| `id`          | integer      | Primary key (auto-increment)                           |
| `userId`      | varchar(255) | Foreign key to users table                             |
| `channelId`   | varchar(255) | Discord channel ID                                     |
| `channelName` | varchar(255) | Discord channel name (optional)                        |
| `guildId`     | varchar(255) | Discord guild (server) ID                              |
| `status`      | varchar(50)  | Integration status: 'pending', 'completed', or 'error' |
| `createdAt`   | timestamp    | Creation timestamp                                     |
| `updatedAt`   | timestamp    | Last update timestamp                                  |

## Environment Variables

Add these to your `.env` file:

```bash
# Discord Bot Token from Discord Developer Portal
DISCORD_BOT_TOKEN="your_bot_token_here"

# Your Discord Server (Guild) ID
DISCORD_GUILD_ID="your_guild_id_here"
```

### How to Get These Values

1. **Bot Token**:
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application or select existing
   - Navigate to "Bot" section
   - Click "Reset Token" and copy the token
   - Enable required intents: Server Members Intent, Message Content Intent

2. **Guild ID**:
   - Open Discord
   - Enable Developer Mode: User Settings → Advanced → Developer Mode
   - Right-click your server icon → Copy Server ID

## API Endpoints

### 1. Register Channel

**Endpoint**: `discord.registerChannel`

**Type**: Protected Mutation (requires authentication)

**Input**:

```typescript
{
  channelId: string;      // Required: Discord channel ID
  channelName?: string;   // Optional: Channel name for display
}
```

**Validations**:

1. ✅ Channel exists in Discord
2. ✅ Channel belongs to configured guild
3. ✅ Channel is a text channel (type 0)
4. ✅ Bot has permission to send messages
5. ✅ Sends test message to verify permissions

**Response**:

```typescript
{
  success: boolean;
  message: string;
  integration: {
    channelId: string;
    channelName: string;
    status: "completed";
  }
}
```

**Behavior**:

- If user has no existing integration → Creates new record
- If user has existing integration → Updates existing record (no duplication)
- On error → Sets status to "error" and throws descriptive error

### 2. Get Integration

**Endpoint**: `discord.getIntegration`

**Type**: Protected Query (requires authentication)

**Response**:

```typescript
{
  id: number;
  userId: string;
  channelId: string;
  channelName: string | null;
  guildId: string;
  status: "pending" | "completed" | "error";
  createdAt: Date;
  updatedAt: Date | null;
} | undefined
```

### 3. List Channels

**Endpoint**: `discord.listChannels`

**Type**: Protected Query (requires authentication)

**Response**:

```typescript
Array<{
  id: string;
  name: string;
}>;
```

Returns only text channels from the configured guild.

## Usage Example

### Frontend Component

```typescript
import { api } from "~/trpc/react";

function MyComponent() {
  // Get current integration
  const { data: integration } = api.discord.getIntegration.useQuery();

  // List available channels
  const { data: channels } = api.discord.listChannels.useQuery();

  // Register channel mutation
  const registerChannel = api.discord.registerChannel.useMutation({
    onSuccess: (data) => {
      console.log("Success:", data.message);
    },
    onError: (error) => {
      console.error("Error:", error.message);
    },
  });

  // Register a channel
  const handleRegister = (channelId: string) => {
    registerChannel.mutate({ channelId });
  };

  return (
    <div>
      <h2>Status: {integration?.status ?? "Not configured"}</h2>
      {/* Your UI here */}
    </div>
  );
}
```

### Server-side Usage

```typescript
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Create context with session
const ctx = await createTRPCContext({ headers: new Headers() });
const caller = createCaller(ctx);

// Register channel
const result = await caller.discord.registerChannel({
  channelId: "1234567890",
  channelName: "notifications",
});
```

## Error Handling

The endpoint provides detailed error messages for various scenarios:

| Error              | Description                                 |
| ------------------ | ------------------------------------------- |
| Channel not found  | Channel doesn't exist or bot lacks access   |
| Wrong guild        | Channel doesn't belong to configured server |
| Not a text channel | Selected channel must be a text channel     |
| Permission denied  | Bot can't send messages in the channel      |
| Invalid input      | Missing or invalid channel ID               |

## Acceptance Criteria

✅ **Channel saved correctly**: Channel ID and metadata stored in database

✅ **Status updated**: Integration status changes to "completed" on success

✅ **No duplication**: Updating channel modifies existing record instead of creating new one

✅ **UI integration**: Frontend can call endpoint and handle responses

✅ **Validation**: All validations (existence, guild, permissions) work correctly

✅ **Test message**: Confirmation message sent to channel on successful registration

## Testing

### Manual Testing

1. **Setup**:

   ```bash
   # Add environment variables
   DISCORD_BOT_TOKEN="your_token"
   DISCORD_GUILD_ID="your_guild_id"

   # Run migrations
   npx drizzle-kit push

   # Start dev server
   npm run dev
   ```

2. **Test Registration**:
   - Navigate to integration page
   - Select a channel from dropdown
   - Click "Register Channel"
   - Verify test message appears in Discord
   - Check database for new record

3. **Test Update**:
   - Select a different channel
   - Click "Update Channel"
   - Verify no duplicate records created
   - Verify new test message in new channel

4. **Test Validation**:
   - Try invalid channel ID → Should show error
   - Try channel from different server → Should show error
   - Try voice channel → Should show error
   - Remove bot permissions → Should show error

## Migration

To apply the database schema:

```bash
# Generate migration
npx drizzle-kit generate

# Push to database
npx drizzle-kit push
```

## Security Considerations

- ✅ All endpoints require authentication (protectedProcedure)
- ✅ Bot token stored securely in environment variables
- ✅ Guild ID validation prevents cross-server attacks
- ✅ Permission checks prevent unauthorized channel access
- ✅ User can only manage their own integration

## Future Enhancements

- [ ] Support for multiple channels per user
- [ ] Webhook-based notifications instead of bot messages
- [ ] Channel category selection
- [ ] Custom message templates
- [ ] Integration health monitoring
- [ ] Automatic permission recovery

## Troubleshooting

### Bot can't see channels

- Ensure bot is invited to server with proper permissions
- Required permissions: View Channels, Send Messages
- Bot must have access to the specific channel

### "Channel not found" error

- Verify DISCORD_GUILD_ID matches your server
- Check bot is in the server
- Ensure channel ID is correct

### Permission errors

- Bot needs "Send Messages" permission in the channel
- Check channel-specific permission overrides
- Verify bot role has sufficient permissions

## Related Files

- `/src/server/api/routers/discord.ts` - Main router implementation
- `/src/server/db/schema.ts` - Database schema
- `/src/components/discord-integration.tsx` - Example UI component
- `/src/env.js` - Environment variable configuration
