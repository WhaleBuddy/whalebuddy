# Quick Start Guide - Discord Channel Registration

## 🚀 Get Started in 5 Minutes

### Step 1: Configure Environment Variables

Add these to your `.env` file:

```bash
# Get from Discord Developer Portal
DISCORD_BOT_TOKEN="your_bot_token_here"

# Your Discord server ID (right-click server → Copy Server ID)
DISCORD_GUILD_ID="your_guild_id_here"
```

**How to get these values:**

1. **Bot Token**:
   - Visit https://discord.com/developers/applications
   - Click "New Application" or select existing
   - Go to "Bot" tab → Click "Reset Token" → Copy it
   - ⚠️ Keep this secret! Never commit to git

2. **Guild ID**:
   - Open Discord → Settings → Advanced → Enable "Developer Mode"
   - Right-click your server icon → "Copy Server ID"

### Step 2: Invite Bot to Your Server

Use this URL (replace `YOUR_CLIENT_ID` with your application's client ID):

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2048&scope=bot
```

**Required Permissions:**

- ✅ View Channels
- ✅ Send Messages

### Step 3: Apply Database Migration

```bash
cd /root/whalebuddy
npx drizzle-kit push
```

Select "create column" for all prompts.

### Step 4: Test the Integration

#### Option A: Use the Example Component

```typescript
// In your page.tsx
import { DiscordIntegration } from "~/components/discord-integration";

export default function IntegrationPage() {
  return (
    <main className="container mx-auto p-8">
      <DiscordIntegration />
    </main>
  );
}
```

#### Option B: Use the API Directly

```typescript
import { api } from "~/trpc/react";

function MyComponent() {
  const registerChannel = api.discord.registerChannel.useMutation();

  const handleRegister = () => {
    registerChannel.mutate({
      channelId: "1234567890", // Your channel ID
      channelName: "notifications"
    });
  };

  return <button onClick={handleRegister}>Register</button>;
}
```

### Step 5: Verify It Works

1. Start your dev server: `npm run dev`
2. Navigate to your integration page
3. Select a channel from the dropdown
4. Click "Register Channel"
5. Check Discord - you should see: "✅ Whalebuddy integration configured successfully!"

## 📋 Checklist

- [ ] Added `DISCORD_BOT_TOKEN` to `.env`
- [ ] Added `DISCORD_GUILD_ID` to `.env`
- [ ] Bot invited to Discord server
- [ ] Bot has "Send Messages" permission
- [ ] Database migration applied
- [ ] Dev server running
- [ ] Test message received in Discord

## 🐛 Troubleshooting

### "Channel not found" error

- ✅ Verify bot is in your server
- ✅ Check `DISCORD_GUILD_ID` is correct
- ✅ Ensure channel ID is valid

### "No permissions" error

- ✅ Bot needs "Send Messages" permission
- ✅ Check channel-specific permission overrides
- ✅ Verify bot role is above restricted roles

### "Wrong server" error

- ✅ Channel must be from the server specified in `DISCORD_GUILD_ID`
- ✅ Double-check your guild ID

## 🎯 What's Next?

Now that the endpoint is working, you can:

1. **Customize the UI** - Modify `/src/components/discord-integration.tsx`
2. **Add to your app** - Import the component where needed
3. **Send notifications** - Use the saved channel ID to send messages
4. **Monitor status** - Check integration status with `getIntegration` query

## 📚 Full Documentation

For complete API reference and advanced usage, see:

- `/docs/discord-integration.md` - Complete documentation
- `/docs/discord-implementation-summary.md` - Implementation details

## 💡 Example: Sending a Notification

```typescript
// Server-side code
import { env } from "~/env";

async function sendNotification(channelId: string, message: string) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${channelId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    },
  );

  return response.ok;
}

// Usage
const integration = await db.query.discordIntegrations.findFirst({
  where: eq(discordIntegrations.userId, userId),
});

if (integration?.channelId) {
  await sendNotification(integration.channelId, "Hello from Whalebuddy! 🐋");
}
```

## ✅ Success!

You now have a fully functional Discord channel registration system! 🎉

The endpoint validates everything automatically:

- ✅ Channel exists
- ✅ Belongs to your server
- ✅ Bot has permissions
- ✅ No duplicate registrations
- ✅ Status tracking

Happy coding! 🚀
