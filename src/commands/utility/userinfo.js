const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Displays information about a user.')
        .addUserOption(option => option.setName('user').setDescription('User to get info about').setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const joined = member ? member.joinedAt.toLocaleString() : 'Unknown';
        const roles = member ? member.roles.cache.map(r => r.name).join(', ') : 'Unknown';
        await interaction.reply(`Username: ${user.tag}\nID: ${user.id}\nJoined: ${joined}\nRoles: ${roles}`);
    },
};
