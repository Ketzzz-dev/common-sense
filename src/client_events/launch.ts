import { Event } from "../Structures/Event"
import CustomEventHandler from '../Util/CustomEventHandler'
import Logger from '../Util/Logger'

export default new Event('ready', async (client) => {
    Logger.info(`Logged in as ${client.user.tag}!`)

    await CustomEventHandler.initialise()
})