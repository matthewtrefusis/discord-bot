const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get your avatar URL.'),
    async execute(interaction) {
        await interaction.reply(interaction.user.displayAvatarURL({ dynamic: true }));
    },
};
