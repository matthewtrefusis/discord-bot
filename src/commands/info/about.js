const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Displays information about the bot.'),
    async execute(interaction) {
        if (interaction.replied || interaction.deferred) return;
        try {
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            await interaction.reply({
                embeds: [{
                    color: 0x5865F2,
                    title: 'About the Bot',
                    description: `Uptime: ${hours}h ${minutes}m ${seconds}s\nMemory Usage: ${memory} MB\nPlatform: ${os.platform()}\nNode.js: ${process.version}`
                }]
            });
        } catch (error) {
            await interaction.reply({ content: 'Error fetching bot info.', ephemeral: true });
        }
    },
};
