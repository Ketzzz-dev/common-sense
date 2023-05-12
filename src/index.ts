import 'dotenv/config'
import Client from './structures/Client'

const client = new Client()

;(async () => {
	await client.loadEvents()
	await client.loadCommands()

	await client.start()
})()