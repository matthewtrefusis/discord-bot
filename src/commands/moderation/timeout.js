const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user for a certain duration.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('minutes')
                .setDescription('Timeout duration in minutes (max 10080)')
                .setRequired(true)),
    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const minutes = interaction.options.getInteger('minutes');
        const member = interaction.guild.members.cache.get(user.id);
        if (!member) {
            await interaction.reply({ content: 'User not found in this server.', ephemeral: true });
            return;
        }
        if (minutes < 1 || minutes > 10080) {
            await interaction.reply({ content: 'Timeout must be between 1 and 10080 minutes.', ephemeral: true });
            return;
        }
        try {
            await member.timeout(minutes * 60 * 1000);
            await interaction.reply({ content: `⏳ Timed out ${user.tag} for ${minutes} minutes.`, ephemeral: true });
        } catch (err) {
            await interaction.reply({ content: 'Failed to timeout user. Check my permissions and role hierarchy.', ephemeral: true });
        }
    },
};
