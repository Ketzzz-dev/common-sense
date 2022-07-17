import { Event } from "../Structures/Event";
import Logger from '../util/Logger'

// our ready event.
export default new Event('ready', (client) => {

    // usually, {client.user} is possibly undefined and we have to call `#isReady()` to make sure it isn't. But since we explicitly extended our Client with `Client<true>`, we don't have to do that!
    Logger.info(`Logged in as ${client.user.tag}!`)

    // WEEZER!
    client.user.setActivity({ name: 'Weezer', type: 'LISTENING' }) // feel free to remove this, this is silly. :)

    // feel free to add your own code here, or you can make a new event file with a different name but still export it as the ready event for ease of management.
})