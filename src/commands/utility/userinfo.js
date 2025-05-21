const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about the user.'),
    async execute(interaction) {
        const user = interaction.user;
        await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
    },
};
