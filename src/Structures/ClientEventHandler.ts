import { readdir } from 'fs/promises'
import { join } from 'path'
import { defaultImport } from '../Util/Common'
import CommonSenseClient from './CommonSenseClient'
import ClientEvent from './ClientEvent'
import Logger from './Logger'

export default class ClientEventHandler {
    public constructor (private client: CommonSenseClient) {}

    public async registerEvents(eventsDirectory: string): Promise<void> {
        Logger.info('Registering events..')

        let eventsPath = join(__dirname, '..', eventsDirectory)

        let eventFiles = (await readdir(eventsPath))
            .filter(file => file.endsWith('.js') || file.endsWith('.ts'))

        for (let file of eventFiles) {
            let filePath = join(eventsPath, file)
            let event = await defaultImport<ClientEvent<any>>(filePath)

            if (!(event instanceof ClientEvent)) {
                Logger.warn('File %s does not export an event!', file)

                continue
            }

            this.client[event.once ? 'once' : 'on'](event.key, event.emit.bind(null, this.client))

            Logger.info('%s: %s - registered!', event.key, file)
        }

        Logger.info('Events registered successfully!')
    }
}