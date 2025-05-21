const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../database/models/guildConfig');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        try {
            const guildConfig = await GuildConfig.findOne({ Guild: member.guild.id });
            if (!guildConfig || !guildConfig.Welcome) return;

            const { Message, Channel, Embed } = guildConfig.Welcome;
            if (!Channel || !Message) return;

            const welcomeChannel = member.guild.channels.cache.get(Channel);
            if (!welcomeChannel) return;

            // Replace variables in message
            const welcomeMessage = Message
                .replace(/{user}/g, member)
                .replace(/{username}/g, member.user.username)
                .replace(/{tag}/g, member.user.tag)
                .replace(/{server}/g, member.guild.name)
                .replace(/{membercount}/g, member.guild.memberCount);

            if (Embed) {
                const embed = new EmbedBuilder()
                    .setColor('#00ff00')
                    .setTitle('Welcome!')
                    .setDescription(welcomeMessage)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setTimestamp();

                await welcomeChannel.send({ embeds: [embed] });
            } else {
                await welcomeChannel.send(welcomeMessage);
            }            // Handle auto role
            if (guildConfig.AutoRole) {
                const role = member.guild.roles.cache.get(guildConfig.AutoRole);
                if (role) {
                    try {
                        await member.roles.add(role);
                        console.log(`[AutoRole] Added role ${role.name} to ${member.user.tag} in ${member.guild.name}`);
                    } catch (roleError) {
                        console.error(`[AutoRole] Failed to add role ${role.name} to ${member.user.tag} in ${member.guild.name}:`, roleError);
                        
                        // Try to notify server owner or admin channel about the error
                        const errorMessage = `⚠️ Failed to add auto role to ${member.user.tag}. Please check my permissions and role hierarchy.`;
                        if (welcomeChannel && welcomeChannel.permissionsFor(member.guild.members.me).has('SendMessages')) {
                            await welcomeChannel.send(errorMessage).catch(() => {});
                        }
                    }
                } else {
                    console.error(`[AutoRole] Role ${guildConfig.AutoRole} not found in ${member.guild.name}`);
                }
            }
        } catch (error) {
            console.error(`[GuildMemberAdd] Error handling new member ${member.user.tag} in ${member.guild.name}:`, error);
        }
    },
};
