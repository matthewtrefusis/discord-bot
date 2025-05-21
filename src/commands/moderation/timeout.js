const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a member for a specified duration (in minutes).')
        .addUserOption(option => option.setName('target').setDescription('The member to timeout').setRequired(true))
        .addIntegerOption(option => option.setName('minutes').setDescription('Duration in minutes').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        const member = interaction.options.getMember('target');
        const minutes = interaction.options.getInteger('minutes');
        if (!member || !member.moderatable) {
            return interaction.reply({ content: 'I cannot timeout this user.', ephemeral: true });
        }
        try {
            await member.timeout(minutes * 60 * 1000, `Timeout by command for ${minutes} minutes`);
            await interaction.reply(`${member.user.tag} was timed out for ${minutes} minutes.`);
        } catch (error) {
            await interaction.reply({ content: 'Failed to timeout the user.', ephemeral: true });
        }
    },
};
