const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Manager } = require('erela.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const log = require('./logger');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        log('Connected to MongoDB');
        console.log('Connected to MongoDB');
    }).catch((error) => {
        log('MongoDB connection error: ' + error);
        console.error('MongoDB connection error:', error);
    });

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates // <-- Add this line for voice channel detection
    ]
});

// Initialize the music player
client.player = new Manager({
    nodes: [{
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
        identifier: "Main Node",
        retryAmount: 5,
        retryDelay: 5000,
        secure: false
    }],
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    },
    // Add auto reconnect and other helpful options
    autoPlay: true,
    clientName: "Discord Music Bot"
});

// Handle raw WebSocket events
client.on("raw", (d) => client.player.updateVoiceState(d));

// Music player event handling
client.player.on("nodeConnect", (node) => {
    log(`Node "${node.options.identifier}" connected.`);
    console.log(`Node "${node.options.identifier}" connected.`);
});

client.player.on("nodeError", (node, error) => {
    log(`Node "${node.options.identifier}" encountered an error: ${error.message}`);
    console.error(`Node "${node.options.identifier}" encountered an error:`, error);
});

client.player.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send(`🎵 Now playing: **${track.title}**`);
});

client.player.on("queueEnd", (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    if (channel) channel.send("Queue ended! Use /play to add more songs.");
    player.destroy();
});

client.player.on("socketClosed", (player, payload) => {
    if (payload.code === 4014) player.destroy();
});

// Initialize Erela.js when the bot is ready
client.on("ready", () => {
    client.player.init(client.user.id);
    log('Music player initialized');
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);
for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.lstatSync(folderPath).isDirectory()) continue;
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(folderPath, file);
        const command = require(filePath);
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

const feedWatcher = require('./events/feedWatcher');
feedWatcher(client);

log('Bot is starting up...');

client.login(process.env.DISCORD_TOKEN).then(() => log('Bot logged in')).catch(e => log('Login error: ' + e));
