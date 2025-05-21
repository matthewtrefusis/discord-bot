const { SlashCommandBuilder } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Get information about the bot.'),
    async execute(interaction) {
        const uptime = Math.floor(process.uptime());
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: 'Bot Information',
                fields: [
                    { name: 'Servers', value: `${interaction.client.guilds.cache.size}`, inline: true },
                    { name: 'Users', value: `${interaction.client.users.cache.size}`, inline: true },
                    { name: 'Uptime', value: `${hours}h ${minutes}m ${seconds}s`, inline: true },
                    { name: 'Platform', value: os.platform(), inline: true },
                    { name: 'Node.js', value: process.version, inline: true }
                ],
                footer: { text: `Bot by ${interaction.client.user.tag}` },
                timestamp: new Date()
            }]
        });
    },
};
