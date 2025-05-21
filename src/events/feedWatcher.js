const { EmbedBuilder } = require('discord.js');
const GuildConfig = require('../database/models/guildConfig');
const fetch = require('node-fetch');

let TWITCH_TOKEN_CACHE = {};

async function getTwitchToken(clientId, clientSecret, guildId) {
    if (TWITCH_TOKEN_CACHE[guildId]) return TWITCH_TOKEN_CACHE[guildId];
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`, { method: 'POST' });
    const data = await res.json();
    TWITCH_TOKEN_CACHE[guildId] = data.access_token;
    return data.access_token;
}

async function checkFeeds(client) {
    const configs = await GuildConfig.find({});
    for (const config of configs) {
        // --- YouTube ---
        if (config.YouTubeFeed && config.YouTubeFeed.Channel && config.YouTubeFeed.Channels?.length && config.YouTubeFeed.ApiKey) {
            for (const channelId of config.YouTubeFeed.Channels) {
                const url = `https://www.googleapis.com/youtube/v3/search?key=${config.YouTubeFeed.ApiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`;
                const res = await fetch(url);
                const data = await res.json();
                const video = data.items?.find(i => i.id.kind === 'youtube#video');
                if (video && config.YouTubeFeed.LastVideos?.get(channelId) !== video.id.videoId) {
                    // New video found
                    const discordChannel = client.channels.cache.get(config.YouTubeFeed.Channel);
                    if (discordChannel) {
                        const embed = new EmbedBuilder()
                            .setTitle(video.snippet.title)
                            .setURL(`https://youtu.be/${video.id.videoId}`)
                            .setDescription(video.snippet.description)
                            .setImage(video.snippet.thumbnails.high.url)
                            .setAuthor({ name: video.snippet.channelTitle })
                            .setTimestamp(new Date(video.snippet.publishedAt));
                        await discordChannel.send({ content: `📢 New YouTube video!`, embeds: [embed] });
                        config.YouTubeFeed.LastVideos.set(channelId, video.id.videoId);
                        await config.save();
                    }
                }
            }
        }
        // --- Twitch ---
        if (config.TwitchFeed && config.TwitchFeed.Channel && config.TwitchFeed.Streamers?.length && config.TwitchFeed.ClientID && config.TwitchFeed.ClientSecret) {
            const token = await getTwitchToken(config.TwitchFeed.ClientID, config.TwitchFeed.ClientSecret, config.Guild);
            for (const streamer of config.TwitchFeed.Streamers) {
                const res = await fetch(`https://api.twitch.tv/helix/streams?user_login=${streamer}`, {
                    headers: {
                        'Client-ID': config.TwitchFeed.ClientID,
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();
                const stream = data.data?.[0];
                if (stream && config.TwitchFeed.LastStreams?.get(streamer) !== stream.id) {
                    // New stream found
                    const discordChannel = client.channels.cache.get(config.TwitchFeed.Channel);
                    if (discordChannel) {
                        const embed = new EmbedBuilder()
                            .setTitle(stream.title)
                            .setURL(`https://twitch.tv/${streamer}`)
                            .setDescription(`${stream.user_name} is now live! Playing ${stream.game_name}`)
                            .setImage(stream.thumbnail_url.replace('{width}', '1280').replace('{height}', '720'))
                            .setTimestamp(new Date(stream.started_at));
                        await discordChannel.send({ content: `🔴 **${stream.user_name} is live on Twitch!**`, embeds: [embed] });
                        config.TwitchFeed.LastStreams.set(streamer, stream.id);
                        await config.save();
                    }
                }
            }
        }
    }
}

module.exports = (client) => {
    setInterval(() => checkFeeds(client), 3 * 60 * 1000); // every 3 minutes
};
