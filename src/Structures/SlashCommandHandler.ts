import { REST } from '@discordjs/rest'
import { Collection, Routes } from 'discord.js'
import { readdir } from 'fs/promises'
import { join } from 'path'
import { defaultImport } from '../Util/Common'
import SlashCommand from './SlashCommand'
import Logger from '../Util/Logger'

export default class CommandHandler {
    public readonly commands = new Collection<string, SlashCommand>()

    public async registerCommands(commandsDirectory: string): Promise<void> {
        Logger.info('Registering commands')

        let commandsPath = join(__dirname, '..', commandsDirectory)

        let categoryDirectories = await readdir(commandsPath)

        for (let directory of categoryDirectories) {
            let commandCategoryPath = join(commandsPath, directory)
            let commandFiles = (await readdir(commandCategoryPath)).filter(file => file.endsWith('.js') || file.endsWith('.ts'))

            for (let file of commandFiles) {
                let filePath = join(commandCategoryPath, file)
                let command = await defaultImport<SlashCommand>(filePath)

                if (!(command instanceof SlashCommand)) {
                    Logger.warn('File %s does not export a command - skipped!', file)

                    continue
                }

                this.commands.set(command.name, command)

                Logger.info('%s: %s - registered!', command.category, command.name)
            }
        }

        let rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!)
        let route = process.env.MODE! == 'dev' ? Routes.applicationGuildCommands(process.env.CLIENT_ID!, process.env.GUILD_ID!) : Routes.applicationCommands(process.env.CLIENT_ID!)

        try {
            await rest.put(route, { body: this.commands.map(command => command.toJSON()) })

            Logger.info('Commands registered successfully!')
        } catch (error) {
            Logger.error('Failed to register commands:', error)
        }
    }
}