const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a member from the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to ban').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        if (!member.bannable) {
            return interaction.reply({ content: 'I cannot ban this user.', ephemeral: true });
        }
        await member.ban();
        await interaction.reply(`${member.user.tag} was banned.`);
    },
};
