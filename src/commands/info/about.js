const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('Displays information about the bot.'),
    async execute(interaction) {
        await interaction.reply('I am a comprehensive Discord bot with 100+ commands!');
    },
};
