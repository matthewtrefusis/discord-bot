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
    }
});

module.exports = mongoose.model('GuildConfig', guildConfigSchema);
