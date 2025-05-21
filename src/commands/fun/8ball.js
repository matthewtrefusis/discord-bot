const { SlashCommandBuilder } = require('discord.js');

const responses = [
    'Yes.', 'No.', 'Maybe.', 'Definitely!', 'Absolutely not.',
    'Ask again later.', 'I don\'t know.', 'Without a doubt.', 'Very doubtful.', 'It is certain.'
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question!')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question for the 8ball')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const answer = responses[Math.floor(Math.random() * responses.length)];
        await interaction.reply({ content: `🎱 **Question:** ${question}\n**Answer:** ${answer}` });
    },
};
