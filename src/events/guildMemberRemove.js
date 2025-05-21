const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../database/models/guildConfig');

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {
        try {
            const guildConfig = await GuildConfig.findOne({ Guild: member.guild.id });
            if (!guildConfig || !guildConfig.Goodbye) return;

            const { Message, Channel, Embed } = guildConfig.Goodbye;
            if (!Channel || !Message) return;

            const goodbyeChannel = member.guild.channels.cache.get(Channel);
            if (!goodbyeChannel) return;

            // Replace variables in message
            const goodbyeMessage = Message
                .replace(/{user}/g, member.user.tag)
                .replace(/{username}/g, member.user.username)
                .replace(/{tag}/g, member.user.tag)
                .replace(/{server}/g, member.guild.name)
                .replace(/{membercount}/g, member.guild.memberCount);

            if (Embed) {
                const embed = new EmbedBuilder()
                    .setColor('#ff0000')
                    .setTitle('Goodbye!')
                    .setDescription(goodbyeMessage)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp();

                await goodbyeChannel.send({ embeds: [embed] });
            } else {
                await goodbyeChannel.send(goodbyeMessage);
            }
        } catch (error) {
            console.error('Error in guildMemberRemove event:', error);
        }
    },
};
