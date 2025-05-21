const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Displays the server icon.'),
    async execute(interaction) {
        const icon = interaction.guild.iconURL({ dynamic: true, size: 4096 });
        if (icon) {
            await interaction.reply({ content: icon });
        } else {
            await interaction.reply('This server has no icon.');
        }
    },
};
