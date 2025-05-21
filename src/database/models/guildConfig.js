const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
    Guild: { type: String, required: true },
    AutoRole: { type: String },
    Welcome: {
        Message: { type: String },
        Channel: { type: String },
        Embed: { type: Boolean, default: false }
    },
    Goodbye: {
        Message: { type: String },
        Channel: { type: String },
        Embed: { type: Boolean, default: false }
    },
    TwitchFeed: {
        Channel: { type: String }, // Discord channel ID
        Streamers: [{ type: String }], // Array of Twitch usernames
        LastStreams: { type: Map, of: String }, // streamer -> last stream id
        ClientID: { type: String },
        ClientSecret: { type: String }
    },
    YouTubeFeed: {
        Channel: { type: String }, // Discord channel ID
        Channels: [{ type: String }], // Array of YouTube channel IDs
        LastVideos: { type: Map, of: String }, // channelId -> last video id
        ApiKey: { type: String }
    }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
