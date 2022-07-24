import { ActivityType, Client, GatewayIntentBits, Partials } from "discord.js"
import { connect } from 'mongoose'
import Logger from './Logger'
import ClientEventHandler from './ClientEventHandler'
import CommandHandler from './CommandHandler'

export default class CommonSenseClient extends Client<true> {
    public readonly eventHandler = new ClientEventHandler(this)
    public readonly commandHandler = new CommandHandler()

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

    public async start(): Promise<void> {
        await this.eventHandler.registerEvents('client_events')
        await this.commandHandler.registerCommands('commands')

        try {
            await connect(process.env.MONGO_URI!)

            Logger.info('Successfully connected to the database!')

            await this.login(process.env.BOT_TOKEN!)
        } catch (error) {
            Logger.error('Unable to connect to database: ', error)
        }
    }
}