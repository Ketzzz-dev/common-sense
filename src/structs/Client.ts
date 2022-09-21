import { ActivityType, Client as BaseClient, Collection, GatewayIntentBits, Partials, Routes } from 'discord.js'
import { Command } from './Command'
import { Logger } from '../util/Logger'
import { join } from 'path'
import { readdir } from 'fs/promises'
import { defaultImport } from '../util/Common'
import { ClientEvent } from './ClientEvent'
import { REST } from '@discordjs/rest'

export class Client extends BaseClient<true> {
    public readonly commands = new Collection<string, Command>()

    public constructor () {
        super({
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildBans,
                GatewayIntentBits.MessageContent,
            ],
            allowedMentions: { repliedUser: false },
            partials: [Partials.Message],
            presence: { 
                activities: [{ name: 'trouble', type: ActivityType.Watching }]
            }
        })
    }

    private async registerEvents(eventsDir: string): Promise<void> {
        Logger.info('Registering client events...')

        let eventsPath = join(__dirname, '..', eventsDir)

        let eventFiles = (await readdir(eventsPath))
            .filter(file => file.endsWith('.js') || file.endsWith('.ts'))

        for (let file of eventFiles) {
            let filePath = join(eventsPath, file)
            let event = await defaultImport<ClientEvent<any>>(filePath)

            if (!Object.hasOwn(event, 'name')) {
                Logger.warn(`File ${file} does not export an event - skipped!`)

                continue
            }

            this[event.once ? 'once' : 'on'](event.name, event.emit.bind(null, this))

            Logger.info(`${event.name}: ${file} - registered!`)
        }

        Logger.info('Client events registered successfully!')
    }
    private async registerCommands(commandsDir: string): Promise<void> {
        Logger.info('Registering commands')

        let commandsPath = join(__dirname, '..', commandsDir)

        let categoryDirs = await readdir(commandsPath)

        for (let directory of categoryDirs) {
            let categoryPath = join(commandsPath, directory)
            let commandFiles = (await readdir(categoryPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

            for (let file of commandFiles) {
                let filePath = join(categoryPath, file)
                let command = await defaultImport<Command>(filePath)

                if (!Object.hasOwn(command, 'name')) {
                    Logger.warn(`File ${file} does not export a command - skipped!`)

                    continue
                }

                this.commands.set(command.name, command)

                Logger.info(`${command.category}: ${command.name} - registered!`)
            }
        }

        let rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!)
        let route = process.env.MODE! == 'dev' ? Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!) : Routes.applicationCommands(process.env.CLIENT_ID!)

        try {
            await rest.put(route, { body: this.commands.map(Command.toJSON) })

            Logger.info('Commands registered successfully!')
        } catch (error) {
            Logger.error('Failed to register commands:', error)
        }
    }

    public async start(): Promise<void> {
        await this.registerEvents('events/client')
        await this.registerCommands('commands')

        await this.login(process.env.BOT_TOKEN!)
    }
}