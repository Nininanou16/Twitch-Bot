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
require('./handler.js')(commands)

client.connect().catch((error) => {
    console.log(error);
});

client.on('message', (channel, tags, message, self) => {
    // if (self) return;

    console.log(tags)
    if (message.toLowerCase().startsWith('!')) {
        let args = message.toLowerCase().split(/^\s+$/);
        let cmdName = args[0];
        let command = commands.get(cmdName);
        if (command) {
            if (command.modOnly && (!tags.mod || !tags.badges.broadcaster == 1)) return;
            if (command.subOnly && !tags.subscriber) return;
            command.run(client, channel, tags, message, self)
        }
    }
});