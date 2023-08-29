module.exports = {
    modOnly: false,
    run: (Client, channel, tags, message, self) => {
        Client.say(channel, "Test OK")
    }
}