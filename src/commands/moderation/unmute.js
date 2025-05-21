const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a member in the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to unmute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        if (!member || !member.moderatable) {
            return interaction.reply({ content: 'I cannot unmute this user.', ephemeral: true });
        }
        try {
            await member.timeout(null, 'Unmuted by command');
            await interaction.reply(`${member.user.tag} was unmuted.`);
        } catch (error) {
            await interaction.reply({ content: 'Failed to unmute the user.', ephemeral: true });
        }
    },
};
