const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelinfo')
        .setDescription('Get information about a channel.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to get info about')
                .setRequired(true)),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        if (!channel) {
            await interaction.reply({ content: 'Channel not found.', ephemeral: true });
            return;
        }
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: `#${channel.name}`,
                description: `ID: ${channel.id}\nType: ${channel.type}`
            }]
        });
    },
};
