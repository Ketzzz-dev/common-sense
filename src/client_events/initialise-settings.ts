import ClientEvent from '../Structures/ClientEvent'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import Logger from '../Structures/Logger'

export default new ClientEvent('guildCreate', async (client, guild) => {
    let { id, name } = guild

    await GuildSettingsModel.initialise(id)

    Logger.info('Initialised settings for %s (%s)', name, id) 
})