const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Get information about the bot.'),
    async execute(interaction) {
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: 'Bot Info',
                description: `Uptime: ${hours}h ${minutes}m ${seconds}s`,
            }]
        });
    },
};
