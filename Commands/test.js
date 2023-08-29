module.exports = {
    modOnly: false,
    subOnly: false,
    cooldown: {
        user: 20,
        general: 10
    },
    run: (Client, channel, tags, message, self) => {
        Client.say(channel, "Test OK")
    }
}