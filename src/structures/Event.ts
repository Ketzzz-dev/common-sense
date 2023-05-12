import { ClientEvents } from 'discord.js'
import Client from './Client'

interface Event<T extends keyof ClientEvents> {
	name: T
	once?: boolean

	emit(client: Client, ...args: ClientEvents[T]): Promise<void>
}

export default Event