const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('Let the bot choose between options.')
        .addStringOption(option =>
            option.setName('options')
                .setDescription('Separate your choices with a comma (e.g. pizza, burger, sushi)')
                .setRequired(true)),
    async execute(interaction) {
        const options = interaction.options.getString('options').split(',').map(opt => opt.trim()).filter(Boolean);
        if (options.length < 2) {
            await interaction.reply({ content: 'Please provide at least two options separated by a comma.', ephemeral: true });
            return;
        }
        const choice = options[Math.floor(Math.random() * options.length)];
        await interaction.reply({ content: `I choose: **${choice}**!` });
    },
};
