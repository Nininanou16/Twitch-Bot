module.exports = {
    modOnly: false,
    subOnly: false,
    cooldown: {
        user: 20,
        general: 10
    },
    run: (twitchClient, channel, tags, message, self) => {
        twitchClient.say(channel, "Test OK")
    }
}