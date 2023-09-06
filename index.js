require('dotenv').config();
const settings = require('./settings.json')
const {twitchClient} = require('tmi.js');
const twitchClient = new twitchClient({
    options: { debug: true },
    identity: {
        username: process.env.TWITCH_USERNAME,
        password: process.env.TWITCH_TOKEN
    },
    channels: settings.channels
});
const twitchCommands = new Map();
let lastUse = new Map();
require('./handler.js')(twitchCommands)

twitchClient.connect().catch((error) => {
    console.log(error);
});

setInterval(() => {
    let random = Math.round(Math.random() * settings.announcements.length)
    twitchClient.say(settings.channels[0], settings.announcements[random - 1])
}, settings.announcementsInterval*1000)

twitchClient.on('message', (channel, tags, message, self) => {
    // if (self) return;
    console.log(channel)

    if (message.toLowerCase().startsWith('!')) {
        let args = message.toLowerCase().split(/^\s+$/);
        let cmdName = args[0];
        let command = commands.get(cmdName);
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