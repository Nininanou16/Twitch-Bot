module.exports = {
    cooldown: {
        user: 60,
        general: 10
    },
    run: (twitchClient, channel, tags, message, self) => {
        twitchClient.say(channel, 'Rejoins nous sur Discord : https://discord.gg/4ckZYPZJX6')
    }
}