const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleinfo')
        .setDescription('Get information about a server role.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to get info about')
                .setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');
        await interaction.reply({
            embeds: [{
                color: role.color || 0x5865F2,
                title: `Role Info: ${role.name}`,
                fields: [
                    { name: 'ID', value: role.id, inline: true },
                    { name: 'Color', value: role.hexColor, inline: true },
                    { name: 'Members', value: `${role.members.size}`, inline: true },
                    { name: 'Mentionable', value: role.mentionable ? 'Yes' : 'No', inline: true },
                    { name: 'Hoisted', value: role.hoist ? 'Yes' : 'No', inline: true },
                    { name: 'Position', value: `${role.position}`, inline: true }
                ],
                timestamp: new Date()
            }]
        });
    },
};
