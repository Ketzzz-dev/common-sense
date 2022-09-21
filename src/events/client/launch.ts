import { ClientEvent } from '../../structs/ClientEvent'
import { Logger } from '../../util/Logger'

export default {
	name: 'ready',

	async emit(client): Promise<any> {
		Logger.info(`Logged in as ${client.user.tag}!`)
	}
} as ClientEvent<'ready'>