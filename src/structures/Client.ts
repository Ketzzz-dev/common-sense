import { ActivityType, Client as BaseClient, Collection, IntentsBitField } from 'discord.js'
import { join } from 'path'
import { readdirSync } from 'fs'

export class Client<T extends boolean = boolean> extends BaseClient<T> {
	public readonly embedColor = 0xf47333

	public readonly commands = new Collection<string, any>()

	public constructor() {
		super({
			intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
			presence: {
				activities: [
					{
						name: 'for trouble...',
						type: ActivityType.Watching
					}
				]
			}
		})
	}

	private loadCommands() {
		const foldersPath = join(__dirname, 'commands')
		const commandFolders = readdirSync(foldersPath)

		for (const folder of commandFolders) {
			const filesPath = join(foldersPath, folder)
			const commandFiles = readdirSync(filesPath)
				.filter(file => file.endsWith('.js'))

			for (const file of commandFiles) {
				const filePath = join(filesPath, file)
				const command = require(filePath)

				if (false) {
					this.commands.set(command.name, command)
				}
			}
		}
	}
}