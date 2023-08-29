require('dotenv').config();
const {Client} = require('tmi.js');
const client = new Client({
    options: { debug: true },
    identity: {
        username: process.env.USERNAME,
        password: process.env.TOKEN
    },
    channels: ['nininanou16']
});
const commands = new Map();
let lastUse = new Map();
require('./handler.js')(commands)

client.connect().catch((error) => {
    console.log(error);
});

client.on('message', (channel, tags, message, self) => {
    // if (self) return;

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
            command.run(client, channel, tags, message, self);
            if (command.cooldown?.user > 0 && command.cooldown?.general > 0) {
                cooldown.general = Date.now();
                cooldown[tags.username] = Date.now()
            }
        }
    }
});