const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ]
});

client.commands = new Collection();

// Recursively load commands from subfolders
function loadCommands(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            const command = require(filePath);
            if (command.data && command.execute) {
                client.commands.set(command.data.name, command);
            }
        }
    }
}

const commandsPath = path.join(__dirname, 'commands');
loadCommands(commandsPath);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Remove the inline interactionCreate handler to use the event system in src/events/interactionCreate.js
// client.on('interactionCreate', async interaction => {
//     if (!interaction.isCommand()) return;
//     const command = client.commands.get(interaction.commandName);
//     if (!command) return;
//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
//     }
// });

client.login(process.env.DISCORD_TOKEN);
