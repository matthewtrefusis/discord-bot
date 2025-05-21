const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member in the server.')
        .addUserOption(option => option.setName('target').setDescription('The member to mute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        if (!member || !member.moderatable) {
            return interaction.reply({ content: 'I cannot mute this user.', ephemeral: true });
        }
        try {
            await member.timeout(60 * 60 * 1000, 'Muted by command'); // 1 hour mute
            await interaction.reply(`${member.user.tag} was muted for 1 hour.`);
        } catch (error) {
            await interaction.reply({ content: 'Failed to mute the user.', ephemeral: true });
        }
    },
};
