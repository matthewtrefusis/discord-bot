const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Remove timeout from a user (unmute).')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to unmute')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            return;
        }
        try {
            await member.timeout(null);
            await interaction.reply({ content: `🔊 Unmuted ${user.tag}.`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: 'Failed to unmute user. Check my permissions and role hierarchy.', ephemeral: true });
        }
    },
};
