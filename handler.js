const {readdir} = require('node:fs/promises')

module.exports = async (twitchCommands) => {
    try {
        const commandList = await readdir('./TwitchCommands')
        for (const command of commandList) {
            if (command.toString().endsWith('.js')) {
                let cmdInfo = require(`./TwitchCommands/${command}`)
                if (cmdInfo) {
                    twitchCommands.set(`!${command.split('.')[0]}`, cmdInfo)
                }
            }
        }
    } catch (e) {
        throw e
    }
}