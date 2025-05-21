const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Set slowmode for a channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Channel to set slowmode in')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('seconds')
                .setDescription('Slowmode duration in seconds (0 to disable)')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const seconds = interaction.options.getInteger('seconds');
        if (!channel.isTextBased()) {
            await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
            return;
        }
        if (seconds < 0 || seconds > 21600) {
            await interaction.reply({ content: 'Slowmode must be between 0 and 21600 seconds.', ephemeral: true });
            return;
        }
        await channel.setRateLimitPerUser(seconds);
        await interaction.reply({ content: `Set slowmode in ${channel} to ${seconds} seconds.`, ephemeral: true });
    },
};
