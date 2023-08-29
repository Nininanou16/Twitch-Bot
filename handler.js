const {readdir} = require('node:fs/promises')

module.exports = async (commands) => {
    try {
        const commandList = await readdir('./Commands')
        for (const command of commandList) {
            if (command.toString().endsWith('.js')) {
                let cmdInfo = require(`./Commands/${command}`)
                if (cmdInfo) {
                    commands.set(`!${command.split('.')[0]}`, cmdInfo)
                }
            }
        }
    } catch (e) {
        throw e
    }
}