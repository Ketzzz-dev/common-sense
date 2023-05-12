import Event from '../structures/Event'

export default {
	name: 'ready',
	once: true,

	async emit(client) {
		console.log(`${client.user.tag} is online!`)
	}
} as Event<'ready'>