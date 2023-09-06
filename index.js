require('dotenv').config();
const { readdirSync } = require('node:fs');
const settings = require('./settings.json');

// Initiate Twitch IRC Client
const tmi = require('tmi.js');
const twitchClient = new tmi.Client({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_TOKEN
    },
    channels: settings.channels
});

const Discord = require('discord.js');
const discordClient = new Discord.Client({ intents: 100143 });
discordClient.login(process.env.DISCORD_TOKEN);
        
const discordEventList = readdirSync('./DiscordEvents')
for (const eventName of discordEventList) { 
    if (eventName.toString().endsWith('.js')) {
        console.log(`Loading ${eventName} event...`)
        const event = require(`./DiscordEvents/${eventName}`)
        discordClient.on(eventName.split('.')[0], event.bind(null, discordClient))
    }
}

// Initiate Twitch and Discord command handler
const twitchCommands = new Map();
const discordCommands = new Map();
const discordEvents = new Map();
let lastUse = new Map();
require('./handler.js')(twitchCommands, discordCommands, discordClient);

twitchClient.connect().catch((error) => {
    console.log(error);
});

setInterval(() => {
    let random = Math.round(Math.random() * settings.announcements.length)
    twitchClient.say(settings.channels[0], settings.announcements[random - 1])
}, settings.announcementsInterval*1000)

twitchClient.on('message', (channel, tags, message, self) => {
    // if (self) return;

    if (message.toLowerCase().startsWith('!')) {
        let args = message.toLowerCase().split(/^\s+$/);
        let cmdName = args[0];
        let command = twitchCommands.get(cmdName);
        if (command) {
            // check permission
            if (command.modOnly && (!tags.mod && tags.badges?.broadcaster != 1)) return;
            if (command.subOnly && !tags.subscriber) return;

            // check cooldown
            let cooldown = lastUse.get(cmdName);
            if (!cooldown) {
                lastUse.set(cmdName, {});
                cooldown = lastUse.get(cmdName)
            }
            if (command.cooldown?.user > 0 && command.cooldown?.general > 0) {
                    if ((Date.now() - cooldown[tags.username]) < (command.cooldown.user*1000)) return;
                    if ((Date.now() - cooldown.general) < (command.cooldown.general*1000)) return;
            }
            command.run(twitchClient, channel, tags, message, self);
            if (command.cooldown?.user > 0 && command.cooldown?.general > 0) {
                cooldown.general = Date.now();
                cooldown[tags.username] = Date.now()
            }
        }
    }
});