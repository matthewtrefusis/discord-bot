const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Displays the number of members in the server.'),
    async execute(interaction) {
        await interaction.reply(`This server has ${interaction.guild.memberCount} members.`);
    },
};
