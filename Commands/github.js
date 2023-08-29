module.exports = {
    cooldown: {
        user: 60,
        general: 10
    },
    run: (Client, channel, tags, message, self) => {
        Client.say(channel, 'Voici le lien du GitHub : https://github.com/Nininanou16')
    }
}