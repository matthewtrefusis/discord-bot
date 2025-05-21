const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const log = require('../../logger');

const FFMPEG_PATH = 'C:/ffmpeg/bin/ffmpeg.exe'; // <-- Update this to your actual ffmpeg.exe path
process.env.FFMPEG_PATH = FFMPEG_PATH;

// Simple in-memory player map for one player per guild
const players = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Music commands')
        .addSubcommand(sub =>
            sub.setName('play')
                .setDescription('Play a song from YouTube')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('YouTube URL or search query')
                        .setRequired(true)))
        .addSubcommand(sub =>
            sub.setName('stop')
                .setDescription('Stop the music and leave the voice channel')),
    async execute(interaction) {
        log(`music.js execute called by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
        const sub = interaction.options.getSubcommand();
        if (sub === 'play') {
            log(`/music play command by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
            // Use interaction.member.voice.channel directly
            const voiceChannel = interaction.member.voice && interaction.member.voice.channel;
            if (!voiceChannel) {
                log('User not in a voice channel');
                await interaction.reply({ content: 'You must be in a voice channel to play music.', ephemeral: true });
                return;
            }
            let query = interaction.options.getString('query');
            let url = query;
            if (!ytdl.validateURL(query)) {
                // Search YouTube
                const result = await ytSearch(query);
                if (!result.videos.length) {
                    log('No results found on YouTube for query: ' + query);
                    await interaction.reply({ content: 'No results found on YouTube.', ephemeral: true });
                    return;
                }
                url = result.videos[0].url;
            }
            let connection;
            try {
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: interaction.guild.id,
                    adapterCreator: interaction.guild.voiceAdapterCreator
                });
            } catch (err) {
                log('Failed to join the voice channel: ' + err);
                await interaction.reply({ content: 'Failed to join the voice channel.', ephemeral: true });
                return;
            }
            let stream;
            try {
                stream = ytdl(url, { filter: 'audioonly', highWaterMark: 1 << 25, ffmpegPath: FFMPEG_PATH });
            } catch (err) {
                log('Failed to play the requested song: ' + err);
                await interaction.reply({ content: 'Failed to play the requested song.', ephemeral: true });
                return;
            }
            const resource = createAudioResource(stream);
            let player = players.get(interaction.guild.id);
            if (!player) {
                player = createAudioPlayer();
                players.set(interaction.guild.id, player);
            }
            player.removeAllListeners();
            player.play(resource);
            connection.subscribe(player);
            player.on(AudioPlayerStatus.Idle, () => {
                connection.destroy();
                players.delete(interaction.guild.id);
            });
            player.on('error', (err) => {
                log('Audio player error: ' + err);
                connection.destroy();
                players.delete(interaction.guild.id);
            });
            await interaction.reply({ content: `🎶 Now playing: ${url}` });
        } else if (sub === 'stop') {
            log(`/music stop command by ${interaction.user.tag} in ${interaction.guild?.name || 'DM'}`);
            const connection = getVoiceConnection(interaction.guild.id);
            if (connection) {
                connection.destroy();
                players.delete(interaction.guild.id);
                await interaction.reply({ content: '⏹️ Music stopped and left the voice channel.' });
            } else {
                log('Tried to stop music but bot was not in a voice channel');
                await interaction.reply({ content: 'I am not in a voice channel.', ephemeral: true });
            }
        }
    },
};
