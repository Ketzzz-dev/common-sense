import { Event } from "../Structures/Event"
import Logger from '../util/Logger'

export default new Event('ready', (client) => {
    Logger.info(`Logged in as ${client.user.tag}!`)
})