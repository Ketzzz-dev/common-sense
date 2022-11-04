import { ClientEvents } from 'discord.js'
import { CommonSenseClient } from './CommonSenseClient'

export interface ClientEvent<K extends keyof ClientEvents> {
    readonly once?: boolean
    readonly name: K

    emit(client: CommonSenseClient, ...args: ClientEvents[K]): any
}