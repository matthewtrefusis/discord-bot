const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get your avatar URL or another user\'s avatar.')
        .addUserOption(option => option.setName('user').setDescription('User to get avatar of').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply(user.displayAvatarURL({ dynamic: true, size: 4096 }));
    },
};
