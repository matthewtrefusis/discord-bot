const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket system for support')
        .addSubcommand(sub =>
            sub.setName('setup')
                .setDescription('Post a ticket button in this channel'))
        .addSubcommand(sub =>
            sub.setName('close')
                .setDescription('Close your ticket')),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const guild = interaction.guild;
        const member = interaction.member;
        const staffRole = guild.roles.cache.find(r => r.name.toLowerCase().includes('staff'));
        if (sub === 'setup') {
            // Post a button for users to open tickets
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('open_ticket')
                    .setLabel('Open Ticket')
                    .setStyle(ButtonStyle.Primary)
            );
            await interaction.reply({
                content: 'Need help? Click the button below to open a support ticket!',
                components: [row],
                ephemeral: false
            });
        } else if (sub === 'close') {
            // Only allow closing in a ticket channel
            if (!interaction.channel.name.startsWith('ticket-')) {
                await interaction.reply({ content: 'You can only use this command in your ticket channel.', ephemeral: true });
                return;
            }
            // Add a close button for confirmation
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('confirm_close_ticket')
                    .setLabel('Confirm Close')
                    .setStyle(ButtonStyle.Danger)
            );
            await interaction.reply({ content: 'Are you sure you want to close this ticket?', components: [row], ephemeral: true });
        }
    },
};

// Button interaction handler (to be placed in your interactionCreate event)
// Example:
// if (interaction.isButton()) {
//   if (interaction.customId === 'open_ticket') { ... }
//   if (interaction.customId === 'confirm_close_ticket') { ... }
// }
