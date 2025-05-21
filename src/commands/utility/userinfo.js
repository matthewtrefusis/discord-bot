const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Get information about a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get info about')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: `User Info: ${user.tag}`,
                thumbnail: { url: user.displayAvatarURL() },
                fields: [
                    { name: 'ID', value: user.id, inline: true },
                    { name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true },
                    { name: 'Created', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`, inline: true },
                    member ? { name: 'Joined', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`, inline: true } : null,
                    member ? { name: 'Roles', value: member.roles.cache.map(r => r.name).join(', '), inline: false } : null
                ].filter(Boolean),
                timestamp: new Date()
            }]
        });
    },
};
