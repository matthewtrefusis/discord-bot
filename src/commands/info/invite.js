const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the bot invite link.'),
    async execute(interaction) {
        const clientId = interaction.client.user.id;
        const invite = `https://discord.com/oauth2/authorize?client_id=${clientId}&scope=bot+applications.commands&permissions=8`;
        await interaction.reply(invite);
    },
};
