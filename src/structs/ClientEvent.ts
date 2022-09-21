import { ClientEvents } from 'discord.js'
import { Client } from './Client'

export interface ClientEvent<K extends keyof ClientEvents> {
    readonly once?: boolean
    readonly name: K

    emit(client: Client, ...args: ClientEvents[K]): any
}