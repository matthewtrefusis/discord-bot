const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song in your voice channel')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song to play (URL or search query)')
                .setRequired(true)),
    async execute(interaction) {
        const log = require('../../logger');
        log(`play.js execute called by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);

        // Check if the user is in a voice channel
        if (!interaction.member.voice.channel) {
            return interaction.reply({ 
                content: "You must be in a voice channel to use this command!", 
                ephemeral: true 
            });
        }

        // Get the client's player manager
        const player = interaction.client.player;
        if (!player) {
            return interaction.reply({ 
                content: "Music system is not initialized. Please try again in a few moments.", 
                ephemeral: true 
            });
        }        try {
            await interaction.deferReply();

            // Get or create a player for this guild
            let guildPlayer;
            try {
                guildPlayer = player.create({
                    guild: interaction.guild.id,
                    voiceChannel: interaction.member.voice.channel.id,
                    textChannel: interaction.channel.id,
                });
            } catch (err) {
                log(`Error creating player: ${err.message}`);
                return interaction.editReply({ 
                    content: "Failed to create music player. Please ensure Lavalink is running.", 
                    ephemeral: true 
                });
            }

            // Connect to the voice channel if not already connected
            if (!guildPlayer.connected) {
                try {
                    guildPlayer.connect();
                    guildPlayer.setVolume(50);
                } catch (err) {
                    log(`Error connecting to voice channel: ${err.message}`);
                    return interaction.editReply({ 
                        content: "Failed to connect to voice channel. Please try again.", 
                        ephemeral: true 
                    });
                }
            }

            await interaction.editReply({ content: "🔎 Searching..." });

            // Search for the track
            const query = interaction.options.getString('song');
            const searchResult = await player.search(query, interaction.user);

            if (searchResult.loadType === 'NO_MATCHES') {
                return interaction.editReply({ 
                    content: "❌ No results found!", 
                    ephemeral: true 
                });
            }

            if (searchResult.loadType === 'LOAD_FAILED') {
                return interaction.editReply({ 
                    content: "❌ Failed to load the track. Please try again.", 
                    ephemeral: true 
                });
            }

            // Handle different types of results
            if (searchResult.loadType === 'PLAYLIST_LOADED') {
                guildPlayer.queue.add(searchResult.tracks);
                interaction.editReply({ 
                    content: `📝 Added playlist **${searchResult.playlist.name}** (${searchResult.tracks.length} tracks) to the queue!` 
                });
            } else {
                const track = searchResult.tracks[0];
                guildPlayer.queue.add(track);
                interaction.editReply({ 
                    content: `📝 Added **${track.title}** to the queue!` 
                });
            }

            if (!guildPlayer.playing && !guildPlayer.paused && guildPlayer.queue.size) {
                guildPlayer.play();
            }

        } catch (error) {
            log('Error in play command:', error);
            return interaction.editReply({ 
                content: "❌ There was an error while executing this command!", 
                ephemeral: true 
            });
        }
    },
};

