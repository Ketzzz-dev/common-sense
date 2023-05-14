import { REST } from '@discordjs/rest'
import { ActivityType, Client as BaseClient, Collection, IntentsBitField, Routes } from 'discord.js'
import { readdir } from 'fs/promises'
import path from 'path'
import Command from './Command'
import Event from './Event'
import { PrismaClient } from '@prisma/client'

export default class Client extends BaseClient<true> {
	public readonly color = 0xf47333

	public readonly commands = new Collection<string, Command>()
	public readonly prisma = new PrismaClient()

	public constructor() {
		super({
			intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMessages],
			allowedMentions: { repliedUser: false },
			presence: {
				activities: [{ name: 'for trouble...', type: ActivityType.Watching }]
			}
		})
	}


	public async loadCommands() {
		const categories = await readdir(path.join(__dirname, '../commands'))

		for (const category of categories) {
			const commandFiles = await readdir(path.join(__dirname, '../commands', category))

			for (const file of commandFiles) {
				const command = require(path.join(__dirname, '../commands', category, file)).default as Command

				this.commands.set(command.name, command)

				console.log(`Loaded command: ${command.name}`)
			}
		}

		const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!)

		try {
			await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: this.commands.map(Command.toJSON) })

			console.log('Commands registered')
		} catch (error) {
			console.error('Failed to register commands:', error)
		}
	}
	public async loadEvents() {
		const eventFiles = await readdir(path.join(__dirname, '../events'))

		for (const file of eventFiles) {
			const event = require(path.join(__dirname, '../events', file)).default as Event<any>

			this[event.once ? 'once' : 'on'](event.name, event.emit.bind(null, this))

			console.log(`Loaded event: ${event.name}`)
		}
	}

	public async start() {
		try {
			await this.prisma.$connect()
			await this.login(process.env.BOT_TOKEN!)
		} catch (error) {
			console.error(error)
		}
	}
}