const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildConfig = require('../../database/models/guildConfig');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Configure server settings')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('welcome')
                .setDescription('Configure welcome settings')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send welcome messages to')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The welcome message (use {user}, {username}, {tag}, {server}, {membercount})')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('embed')
                        .setDescription('Send the message as an embed')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('goodbye')
                .setDescription('Configure goodbye settings')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to send goodbye messages to')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The goodbye message (use {user}, {username}, {tag}, {server}, {membercount})')
                        .setRequired(true))
                .addBooleanOption(option =>
                    option.setName('embed')
                        .setDescription('Send the message as an embed')
                        .setRequired(false)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('autorole')
                .setDescription('Configure auto role')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to automatically give to new members')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('view')
                .setDescription('View current configuration'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('youtube')
                .setDescription('Configure YouTube feed')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Discord channel for YouTube feed')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('ytchannels')
                        .setDescription('Comma-separated YouTube channel IDs')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('twitch')
                .setDescription('Configure Twitch feed')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Discord channel for Twitch feed')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('streamers')
                        .setDescription('Comma-separated Twitch usernames')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('youtubeapikey')
                .setDescription('Set the YouTube API key for this server')
                .addStringOption(option =>
                    option.setName('key')
                        .setDescription('YouTube API Key')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('twitchapikeys')
                .setDescription('Set the Twitch API client ID and secret for this server')
                .addStringOption(option =>
                    option.setName('clientid')
                        .setDescription('Twitch Client ID')
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('clientsecret')
                        .setDescription('Twitch Client Secret')
                        .setRequired(true))),
    async execute(interaction) {
        try {
            if (!interaction.guild) {
                await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }

            let guildConfig = await GuildConfig.findOne({ Guild: interaction.guild.id });
            if (!guildConfig) {
                guildConfig = new GuildConfig({ Guild: interaction.guild.id });
            }

            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'welcome': {
                    const channel = interaction.options.getChannel('channel');
                    const message = interaction.options.getString('message');
                    const embed = interaction.options.getBoolean('embed') ?? false;

                    if (!channel.isTextBased()) {
                        await interaction.reply({
                            content: 'Please select a text channel for welcome messages.',
                            ephemeral: true
                        });
                        return;
                    }

                    guildConfig.Welcome = {
                        Channel: channel.id,
                        Message: message,
                        Embed: embed
                    };

                    await guildConfig.save();
                    await interaction.reply({
                        content: `Welcome message configuration updated!\n**Channel:** ${channel}\n**Message:** ${message}\n**Use Embed:** ${embed}`,
                        ephemeral: true
                    });
                    break;
                }
                case 'goodbye': {
                    const channel = interaction.options.getChannel('channel');
                    const message = interaction.options.getString('message');
                    const embed = interaction.options.getBoolean('embed') ?? false;

                    if (!channel.isTextBased()) {
                        await interaction.reply({
                            content: 'Please select a text channel for goodbye messages.',
                            ephemeral: true
                        });
                        return;
                    }

                    guildConfig.Goodbye = {
                        Channel: channel.id,
                        Message: message,
                        Embed: embed
                    };

                    await guildConfig.save();
                    await interaction.reply({
                        content: `Goodbye message configuration updated!\n**Channel:** ${channel}\n**Message:** ${message}\n**Use Embed:** ${embed}`,
                        ephemeral: true
                    });
                    break;
                }
                case 'autorole': {
                    const role = interaction.options.getRole('role');

                    // Check if the bot can manage the role
                    if (role.managed) {
                        await interaction.reply({
                            content: 'I cannot assign integration or bot roles.',
                            ephemeral: true
                        });
                        return;
                    }

                    // Check if the role is higher than the bot's highest role
                    const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
                    if (role.position >= botMember.roles.highest.position) {
                        await interaction.reply({
                            content: 'I cannot assign roles that are higher than or equal to my highest role.',
                            ephemeral: true
                        });
                        return;
                    }

                    guildConfig.AutoRole = role.id;
                    await guildConfig.save();
                    await interaction.reply({
                        content: `Auto role has been set to ${role.name}`,
                        ephemeral: true
                    });
                    break;
                }
                case 'view': {
                    const embedFields = [];
                    
                    if (guildConfig.Welcome) {
                        embedFields.push({
                            name: '📥 Welcome Settings',
                            value: `Channel: <#${guildConfig.Welcome.Channel}>\nEmbed: ${guildConfig.Welcome.Embed}\nMessage: ${guildConfig.Welcome.Message}`
                        });
                    }
                    
                    if (guildConfig.Goodbye) {
                        embedFields.push({
                            name: '📤 Goodbye Settings',
                            value: `Channel: <#${guildConfig.Goodbye.Channel}>\nEmbed: ${guildConfig.Goodbye.Embed}\nMessage: ${guildConfig.Goodbye.Message}`
                        });
                    }
                    
                    if (guildConfig.AutoRole) {
                        embedFields.push({
                            name: '🎭 Auto Role',
                            value: `Role: <@&${guildConfig.AutoRole}>`
                        });
                    }
                    
                    if (guildConfig.YouTube) {
                        embedFields.push({
                            name: '📺 YouTube Feed',
                            value: `Channel: <#${guildConfig.YouTube.Channel}>\nChannels: ${guildConfig.YouTube.Channels.join(', ')}`
                        });
                    }
                    
                    if (guildConfig.Twitch) {
                        embedFields.push({
                            name: '🎮 Twitch Feed',
                            value: `Channel: <#${guildConfig.Twitch.Channel}>\nStreamers: ${guildConfig.Twitch.Streamers.join(', ')}`
                        });
                    }
                    
                    const embed = {
                        color: 0x0099ff,
                        title: '⚙️ Server Configuration',
                        fields: embedFields.length ? embedFields : [{ name: 'No Configuration', value: 'No settings have been configured yet.' }],
                        timestamp: new Date()
                    };
                    
                    await interaction.reply({ embeds: [embed], ephemeral: true });
                    break;
                }
                case 'youtube': {
                    const channel = interaction.options.getChannel('channel');
                    const ytchannels = interaction.options.getString('ytchannels');
                    const ids = ytchannels.split(',').map(s => s.trim()).filter(Boolean);
                    guildConfig.YouTubeFeed = {
                        Channel: channel.id,
                        Channels: ids,
                        LastVideos: new Map()
                    };
                    await guildConfig.save();
                    await interaction.reply({ content: `YouTube feed configured for <#${channel.id}>. Watching: ${ids.join(', ')}`, ephemeral: true });
                    break;
                }
                case 'twitch': {
                    const channel = interaction.options.getChannel('channel');
                    const streamers = interaction.options.getString('streamers');
                    const names = streamers.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
                    guildConfig.TwitchFeed = {
                        Channel: channel.id,
                        Streamers: names,
                        LastStreams: new Map()
                    };
                    await guildConfig.save();
                    await interaction.reply({ content: `Twitch feed configured for <#${channel.id}>. Watching: ${names.join(', ')}`, ephemeral: true });
                    break;
                }
                case 'youtubeapikey': {
                    const key = interaction.options.getString('key');
                    guildConfig.YouTubeFeed = guildConfig.YouTubeFeed || {};
                    guildConfig.YouTubeFeed.ApiKey = key;
                    await guildConfig.save();
                    await interaction.reply({ content: 'YouTube API key set for this server!', ephemeral: true });
                    break;
                }
                case 'twitchapikeys': {
                    const clientid = interaction.options.getString('clientid');
                    const clientsecret = interaction.options.getString('clientsecret');
                    guildConfig.TwitchFeed = guildConfig.TwitchFeed || {};
                    guildConfig.TwitchFeed.ClientID = clientid;
                    guildConfig.TwitchFeed.ClientSecret = clientsecret;
                    await guildConfig.save();
                    await interaction.reply({ content: 'Twitch API credentials set for this server!', ephemeral: true });
                    break;
                }
            }
        } catch (error) {
            console.error('Error in config command:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'There was an error while updating the configuration.',
                    ephemeral: true
                });
            }
        }
    },
};
