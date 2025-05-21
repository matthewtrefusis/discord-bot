const { Presence } = require("discord.js");

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [
                {
                    name: "Unrekable's Latest Video",
                    url: 'https://www.youtube.com/@Unrekableyt',
                    type: 3 // WATCHING
                },
            ],
            status: 'online',
        });
    },
};