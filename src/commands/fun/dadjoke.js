const { SlashCommandBuilder } = require('discord.js');
const jokes = [
    "I'm reading a book on anti-gravity. It's impossible to put down!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why don't skeletons fight each other? They don't have the guts.",
    "I would tell you a joke about construction, but I'm still working on it.",
    "Why did the math book look sad? Because it had too many problems."
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dadjoke')
        .setDescription('Get a random dad joke.'),
    async execute(interaction) {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        await interaction.reply({ content: joke });
    },
};
