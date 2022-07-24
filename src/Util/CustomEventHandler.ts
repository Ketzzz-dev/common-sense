import { Channel, ClientUser, Collection, Guild, Message, User } from 'discord.js'
import { EventEmitter } from 'eventemitter3'
import { readdir } from 'fs/promises'
import { join } from 'path'
import ClientEvent from '../Structures/ClientEvent'
import { defaultImport } from './Common'

export interface CustomEvents {
    'ban': [client: ClientUser, guild: Guild, moderator: User, user: User, time: string, reason: string]
    'kick': [client: ClientUser, guild: Guild, moderator: User, user: User, reason: string]
    'timeout': [client: ClientUser, guild: Guild, moderator: User, user: User, time: string, reason: string]
    'purge': [client: ClientUser, guild: Guild, moderator: User, channel: Channel, messages: Collection<string, Message>]
}

export class CustomEvent<K extends keyof CustomEvents> {
    public readonly once: boolean

    public constructor(
        public readonly key: K,
        public readonly emit: (...args: CustomEvents[K]) => void,
        once?: boolean
    ) { this.once = once ?? false }
}

export default new class extends EventEmitter<CustomEvents> {

    public async initialise(): Promise<void> {
        let eventsPath = join(__dirname, '..', 'custom_events')
        let eventFiles = (await readdir(eventsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

        for (let file of eventFiles) {
            let filePath = join(eventsPath, file)
            let event = await defaultImport<ClientEvent<any>>(filePath)

            if (!(event instanceof CustomEvent))
                continue

            this[event.once ? 'once' : 'on'](event.key, event.emit)
        }
    }
}