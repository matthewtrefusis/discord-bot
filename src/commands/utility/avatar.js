const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Get the avatar of a user.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to get the avatar of')
                .setRequired(false)),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: `${user.tag}'s Avatar`,
                image: { url: user.displayAvatarURL({ size: 512 }) },
                url: user.displayAvatarURL({ size: 512 })
            }]
        });
    },
};
