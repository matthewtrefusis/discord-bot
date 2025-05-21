const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servericon')
        .setDescription('Get the server icon.'),
    async execute(interaction) {
        const icon = interaction.guild.iconURL({ size: 512 });
        if (!icon) {
            await interaction.reply({ content: 'This server has no icon.', ephemeral: true });
            return;
        }
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: `${interaction.guild.name} Icon`,
                image: { url: icon },
                url: icon
            }]
        });
    },
};
