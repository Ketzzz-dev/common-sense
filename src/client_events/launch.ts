import ClientEvent from "../Structures/ClientEvent"
import CustomEventHandler from '../Util/CustomEventHandler'
import Logger from '../Structures/Logger'

export default new ClientEvent('ready', async (client) => {
    Logger.info('Logged in as %s!', client.user.tag)

    await CustomEventHandler.initialise()
})