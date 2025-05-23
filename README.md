# Discord Bot

A feature-rich Discord bot with moderation, utility, and fun commands.

## Features

- 🎮 Fun commands (coinflip, roll, ping, etc.)
- 🛡️ Moderation commands (kick, ban, mute, etc.)
- ℹ️ Information commands (about, help, serverinfo, etc.)
- ⚙️ Utility commands (avatar, config, etc.)
- 🤝 Welcome/goodbye messages with customizable templates
- 🎭 Auto-role assignment for new members
- 📊 Server statistics and member tracking

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   MONGODB_URI=your_mongodb_connection_string
   ```
4. Deploy slash commands:
   ```bash
   node deploy-commands.js
   ```
5. Start the bot:
   ```bash
   node src/index.js
   ```

## Configuration Variables

The bot uses the following environment variables:

- `DISCORD_TOKEN`: Your Discord bot token from the Discord Developer Portal
- `MONGODB_URI`: MongoDB connection string (e.g., `mongodb://localhost/discord-bot` or Atlas URI)

## Message Variables

You can use these variables in welcome/goodbye messages:

- `{user}` - Mentions the user
- `{username}` - User's name without mention
- `{tag}` - User's full tag (e.g., username#1234)
- `{server}` - Server name
- `{membercount}` - Current member count

## Commands

Here are some of the available commands:

### Utility
- `/config welcome` - Configure welcome messages
- `/config goodbye` - Configure goodbye messages
- `/config autorole` - Set up automatic role assignment

### Moderation
- `/kick` - Kick a member
- `/ban` - Ban a member
- `/mute` - Timeout a member
- `/warn` - Warn a member

### Info
- `/serverinfo` - Display server information
- `/userinfo` - Display user information
- `/help` - Show command list

### Fun
- `/coinflip` - Flip a coin
- `/roll` - Roll a die
- `/ping` - Check bot latency

## Contributing

Feel free to submit issues and pull requests for new features or bug fixes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.