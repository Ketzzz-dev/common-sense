import { REST } from "@discordjs/rest"
import { ActivityType, Client, Collection, GatewayIntentBits, Partials, Routes } from "discord.js"
import { readdir } from "fs/promises"
import { join } from "path"
import { connect } from 'mongoose'
import { Command } from "./Command"
import { Event } from "./Event"
import { defaultImport } from "../Util/Common"
import Logger from '../Util/Logger'

/**
 * The client class.
 */
export class CommonSenseClient extends Client<true> {
    public readonly commands = new Collection<string, Command>()

    public constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildPresences,
                GatewayIntentBits.MessageContent
            ],
            allowedMentions: { repliedUser: false },
            partials: [Partials.Message],
            presence: { activities: [{ name: 'Weezer', type: ActivityType.Listening }] }
        })
    }

    /**
     * Registers and listens for the client events.
     */
    private async registerEvents(): Promise<void> {
        Logger.info('Registering events...')

        let eventsPath = join(__dirname, '..', 'client_events')
        let eventFiles = (await readdir(eventsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))
        for (let file of eventFiles) {
            let filePath = join(eventsPath, file)
            let event = await defaultImport<Event<any>>(filePath)

            if (!(event instanceof Event)) {
                Logger.warn(`${file} does not export an Event class - failed!`)

                continue
            }

            this[event.once ? 'once' : 'on'](event.key, event.emit.bind(null, this))

            Logger.info(`${event.key}: ${file} - successful!`)
        }

        Logger.info('Events registered!')
    }

    /**
     * Registers the application commands.
     */
    private async registerCommands(): Promise<void> {
        Logger.info('Registering commands...')

        let categoriesPath = join(__dirname, '..', 'commands')
        let categoryDirectories = await readdir(categoriesPath)

        for (let directory of categoryDirectories) {
            let commandsPath = join(categoriesPath, directory)
            let commandFiles = (await readdir(commandsPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

            for (let file of commandFiles) {
                let filePath = join(commandsPath, file)
                let command = await defaultImport<Command>(filePath)

                if (!(command instanceof Command)) {
                    Logger.warn(`${file} does not export a Command class - failed!`)

                    continue
                }

                this.commands.set(command.name, command)

                Logger.info(`${command.category}: ${command.name} - successful!`)
            }
        }

        let rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!)
        let route = process.env.MODE! == 'dev' ? Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!) : Routes.applicationCommands(process.env.CLIENT_ID!)

        try {
            await rest.put(route, { body: this.commands.map(command => command.toJSON()) })

            Logger.info('Commands registered!')
        } catch (error: any) {
            Logger.error('Failed to register commands')
            console.error(error)
        }
    }

    /**
     * Launches the client.
     */
    public async start(): Promise<void> {
        await this.registerEvents()
        await this.registerCommands()

        try {
            await connect(process.env.MONGO_URI!)

            Logger.info('Successfully connected to the database!')

            await this.login(process.env.BOT_TOKEN!)
        } catch (error) {
            Logger.error('Unable to connect to database')
            console.error(error)
        }
    }
}