const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a simple yes/no poll.')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The poll question')
                .setRequired(true)),
    async execute(interaction) {
        const question = interaction.options.getString('question');
        const pollMessage = await interaction.reply({
            embeds: [{
                color: 0x5865F2,
                title: '📊 Poll',
                description: question,
                footer: { text: `Poll by ${interaction.user.tag}` },
                timestamp: new Date()
            }],
            fetchReply: true
        });
        await pollMessage.react('👍');
        await pollMessage.react('👎');
    },
};
