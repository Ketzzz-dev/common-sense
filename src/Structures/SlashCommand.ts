import { ChatInputCommandInteraction, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { SlashCommandOption } from './SlashCommandOptions'
import CommonSenseClient from './CommonSenseClient'

export type SlashCommandExecute = (client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>

export interface ISlashCommandConfig {
    name: string
    category: string
    description: string
    permissions?: bigint
    options?: SlashCommandOption[]
}

export default class SlashCommand {
    private permissions?: bigint
    private options?: SlashCommandOption[]

    public readonly name: string
    public readonly category: string
    public readonly description: string

    public constructor (
        config: ISlashCommandConfig,
        public readonly execute: SlashCommandExecute
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