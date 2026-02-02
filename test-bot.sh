#!/bin/bash

# WhaleBuddy Discord Bot Test Script
# Usage: ./test-bot.sh "Your message here"

# Load environment variables
source .env

# Default message if none provided
MESSAGE="${1:-🐋 Test message from WhaleBuddy! $(date +%H:%M:%S)}"

# Channel ID for #geral
CHANNEL_ID="1447756329941733640"

echo "Sending message to Discord..."
echo "Message: $MESSAGE"

curl -X POST \
  -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"$MESSAGE\"}" \
  "https://discord.com/api/v10/channels/$CHANNEL_ID/messages" \
  2>/dev/null | jq -r '.id // "Error"' | \
  if grep -q "^[0-9]*$"; then
    echo "✅ Message sent successfully!"
  else
    echo "❌ Failed to send message"
  fi
