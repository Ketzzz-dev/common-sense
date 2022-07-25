import { ChatInputCommandInteraction, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { CommandOption } from './CommandOptions'
import CommonSenseClient from './CommonSenseClient'

export type CommandExecute = (client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>

export interface ICommandConfig {
    name: string
    category: string
    description: string
    permissions?: bigint
    options?: CommandOption[]
}

export default class Command {
    private permissions?: bigint
    private options?: CommandOption[]

    public readonly name: string
    public readonly category: string
    public readonly description: string

    public constructor (
        config: ICommandConfig,
        public readonly execute: CommandExecute
    ) {
        let { name, category, description, permissions, options } = config

        this.name = name
        this.category = category
        this.description = description

        if (permissions)
            this.permissions = PermissionsBitField.resolve(permissions)
        if (options)
            this.options = options
    }

    public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        let json: RESTPostAPIApplicationCommandsJSONBody = {
            name: this.name, description: this.description,
            dm_permission: false,
        }

        if (this.permissions)
            json.default_member_permissions = `${this.permissions}`
        if (this.options)
            json.options = this.options.map(o => o.toJSON())

        return json
    }
}

SlashCommandBuilder