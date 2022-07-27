import { ChatInputCommandInteraction, PermissionResolvable, PermissionsBitField, RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'
import { SlashCommandOption } from './SlashCommandOptions'
import CommonSenseClient from './CommonSenseClient'

export type SlashCommandExecute = (client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>

export interface ISlashCommandConfig {
    name: string
    category: string
    description: string
    memberPerms?: PermissionResolvable
    botPerms?: PermissionResolvable
    options?: SlashCommandOption[]
}

export default class SlashCommand {
    public readonly name: string
    public readonly category: string
    public readonly description: string
    
    public readonly memberPerms?: bigint
    public readonly botPerms?: bigint
    public readonly options?: SlashCommandOption[]

    public constructor (
        config: ISlashCommandConfig,
        public readonly execute: SlashCommandExecute
    ) {
        let { name, category, description, memberPerms, botPerms, options } = config

        this.name = name
        this.category = category
        this.description = description

        if (memberPerms)    
            this.memberPerms = PermissionsBitField.resolve(memberPerms)        
        if (botPerms)    
            this.botPerms = PermissionsBitField.resolve(botPerms)
        if (options)
            this.options = options
    }

    public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        let json: RESTPostAPIApplicationCommandsJSONBody = {
            name: this.name, description: this.description,
            dm_permission: false,
        }

        if (this.memberPerms)
            json.default_member_permissions = `${this.memberPerms}`
        if (this.options)
            json.options = this.options.map(o => o.toJSON())

        return json
    }
}