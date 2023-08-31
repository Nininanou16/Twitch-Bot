module.exports = {
    cooldown: {
        user: 60,
        general: 10
    },
    run: (Client, channel, tags, message, self) => {
        Client.say(channel, 'Rejoins nous sur Discord : https://discord.gg/4ckZYPZJX6')
    }
}