import ClientEvent from "../Structures/ClientEvent"
import Logger from '../Util/Logger'

export default new ClientEvent('ready', async (client) => {
    Logger.info('Logged in as %s!', client.user.tag)
})