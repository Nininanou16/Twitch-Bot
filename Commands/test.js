module.exports = {
    modOnly: false,
    subOnly: false,
    run: (Client, channel, tags, message, self) => {
        Client.say(channel, "Test OK")
    }
}