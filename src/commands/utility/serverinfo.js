const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),
    async execute(interaction) {
        const guild = interaction.guild;
        await interaction.reply(`Server name: ${guild.name}\nTotal members: ${guild.memberCount}`);
    },
};
