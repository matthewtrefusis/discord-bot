const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const path = require('path');

const commands = [];
const foldersPath = path.join(__dirname, 'src', 'commands'); // Use src/commands relative to project root
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    if (!fs.lstatSync(commandsPath).isDirectory()) continue;
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
        if (error.code === 50035) {
            console.error('Check that your CLIENT_ID is correct and that your bot is invited with the applications.commands scope.');
        }
    }
})();
