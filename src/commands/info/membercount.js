const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Show the server member count.'),
    async execute(interaction) {
        await interaction.reply({ content: `👥 This server has **${interaction.guild.memberCount}** members.` });
    },
};
