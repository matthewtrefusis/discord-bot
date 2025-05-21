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
            const info = `I am a comprehensive Discord bot with 100+ commands!\n` +
                `Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                `Memory Usage: ${memory} MB\n` +
                `Host: ${os.hostname()}`;
            await interaction.reply(info);
        } catch (error) {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
            }
            throw error;
        }
    },
};
