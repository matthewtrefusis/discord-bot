const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Get a random meme from Reddit.'),
    async execute(interaction) {
        try {
            const res = await fetch('https://meme-api.com/gimme');
            const data = await res.json();
            await interaction.reply({
                embeds: [{
                    color: 0x5865F2,
                    title: data.title,
                    image: { url: data.url },
                    url: data.postLink,
                    footer: { text: `👍 ${data.ups} | From r/${data.subreddit}` }
                }]
            });
        } catch (err) {
            await interaction.reply({ content: 'Could not fetch a meme right now. Try again later!', ephemeral: true });
        }
    },
};
