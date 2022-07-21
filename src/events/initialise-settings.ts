import { Event } from '../Structures/Event'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import Logger from '../Util/Logger'


export default new Event('guildCreate', async (client, guild) => {
    let { id, name } = guild

    await GuildSettingsModel.initialise(id)

    Logger.info(`Initialised settings for ${name} (${id})`) 
})