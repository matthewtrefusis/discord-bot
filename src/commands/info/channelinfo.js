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
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: `Channel Info: #${channel.name}`,
                fields: [
                    { name: 'ID', value: channel.id, inline: true },
                    { name: 'Type', value: channel.type, inline: true },
                    { name: 'NSFW', value: channel.nsfw ? 'Yes' : 'No', inline: true },
                    { name: 'Position', value: `${channel.position}`, inline: true },
                    { name: 'Created', value: `<t:${Math.floor(channel.createdTimestamp/1000)}:F>`, inline: true }
                ],
                timestamp: new Date()
            }]
        });
    },
};
