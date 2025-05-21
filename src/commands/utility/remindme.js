const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remindme')
        .setDescription('Set a reminder!')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time until reminder (e.g. 10m, 2h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Reminder message')
                .setRequired(true)),
    async execute(interaction) {
        const timeStr = interaction.options.getString('time');
        const message = interaction.options.getString('message');
        const ms = parseTime(timeStr);
        if (!ms) {
            await interaction.reply({ content: 'Invalid time format! Use m (minutes), h (hours), or d (days).', ephemeral: true });
            return;
        }
        await interaction.reply({ content: `⏰ I will remind you in ${timeStr}: ${message}`, ephemeral: true });
        setTimeout(() => {
            interaction.user.send(`⏰ Reminder: ${message}`);
        }, ms);
    },
};

function parseTime(str) {
    const match = str.match(/^(\d+)([mhd])$/);
    if (!match) return null;
    const num = parseInt(match[1]);
    switch (match[2]) {
        case 'm': return num * 60 * 1000;
        case 'h': return num * 60 * 60 * 1000;
        case 'd': return num * 24 * 60 * 60 * 1000;
        default: return null;
    }
}
