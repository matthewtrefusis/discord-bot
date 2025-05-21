const log = require('../logger');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Handle ticket buttons
        if (interaction.isButton()) {
            log(`Button used: ${interaction.customId} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
            const guild = interaction.guild;
            const member = interaction.member;
            const staffRole = guild.roles.cache.find(r => r.name.toLowerCase().includes('staff'));
            if (interaction.customId === 'open_ticket') {
                // Check if user already has a ticket
                const existing = guild.channels.cache.find(c => c.name === `ticket-${member.user.id}`);
                if (existing) {
                    await interaction.reply({ content: `You already have an open ticket: ${existing}`, ephemeral: true });
                    return;
                }
                // Create channel
                const overwrites = [
                    { id: guild.id, deny: ['ViewChannel'] },
                    { id: member.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] }
                ];
                if (staffRole) overwrites.push({ id: staffRole.id, allow: ['ViewChannel', 'SendMessages'] });
                const channel = await guild.channels.create({
                    name: `ticket-${member.user.id}`,
                    type: 0, // GUILD_TEXT
                    permissionOverwrites: overwrites
                }).catch(async err => {
                    await interaction.reply({ content: 'Failed to create ticket channel. Check my permissions.', ephemeral: true });
                    return null;
                });
                if (!channel) return;
                // Always include the close button in the ticket channel
                const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
                const closeRow = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('confirm_close_ticket')
                        .setLabel('Close Ticket')
                        .setStyle(ButtonStyle.Danger)
                );
                await channel.send({
                    content: `<@${member.user.id}> Ticket created! A staff member will be with you soon.\nTo close this ticket, use the button below or /ticket close.`,
                    components: [closeRow]
                });
                await interaction.reply({ content: `Your ticket has been created: ${channel}`, ephemeral: true });
                return;
            }
            if (interaction.customId === 'confirm_close_ticket') {
                if (!interaction.channel.name.startsWith('ticket-')) {
                    await interaction.reply({ content: 'You can only use this button in a ticket channel.', ephemeral: true });
                    return;
                }
                await interaction.reply({ content: 'Closing ticket in 3 seconds...', ephemeral: true });
                setTimeout(() => interaction.channel.delete().catch(() => {}), 3000);
                return;
            }
        }
        if (!interaction.isCommand()) return;
        log(`Command used: /${interaction.commandName} by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            log(`Error in command /${interaction.commandName}: ${error}`);
            console.error(error);
            await interaction.reply({ content: 'There was an error executing that command!', ephemeral: true });
        }
    },
};
