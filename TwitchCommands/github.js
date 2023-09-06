module.exports = {
    cooldown: {
        user: 60,
        general: 10
    },
    run: (twitchClient, channel, tags, message, self) => {
        twitchClient.say(channel, 'Voici le lien du GitHub : https://github.com/Nininanou16')
    }
}