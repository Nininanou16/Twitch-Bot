const {readdir} = require('node:fs/promises')

module.exports = async (twitchCommands, discordCommands, discordClient) => {
    try {
        const twitchCommandList = await readdir('./TwitchCommands')
        for (const command of twitchCommandList) {
            if (command.toString().endsWith('.js')) {
                let cmdInfo = require(`./TwitchCommands/${command}`)
                if (cmdInfo) {
                    twitchCommands.set(`!${command.split('.')[0]}`, cmdInfo)
                }
            }
        }
        
        const discordCommandList = await readdir('./DiscordCommands')
        for (const command of discordCommandList) { 
            if (command.toString().endsWith('.js')) {
                let cmdInfo = require(`./DiscordCommands/${command}`)
                if (cmdInfo) {
                    discordCommands.set(`${command.split('.')[0]}`, cmdInfo)
                }
            }
        }
    } catch (e) {
        throw e
    }
}