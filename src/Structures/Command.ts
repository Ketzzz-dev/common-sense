import { PermissionsBitField, APIApplicationCommandOption, PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody, ChatInputCommandInteraction } from "discord.js"
import { CommonSenseClient } from "./Client"

/**
 * The configuration object to pass in the Command constructor.
 */
export interface ICommandConfig {
    name: string; category: string; description: string
    options?: APIApplicationCommandOption[]; permissions?: PermissionResolvable
}

/**
 * The command class.
 */
export class Command {
    private readonly options: APIApplicationCommandOption[]
    private readonly permissions: `${bigint}`

    /**
     * The name of the command.
     */
    public readonly name: string
    /**
     * The category of the command.
     */
    public readonly category: string
    /**
     * The command's description.
     */
    public readonly description: string

    /**
     * @param config - The configuration object.
     * @param execute - The command's execute function.
     */
    public constructor(
        config: ICommandConfig,
        public readonly execute: (client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>) => Promise<any>
    ) {
        this.name = config.name
        this.category = config.category
        this.description = config.description

        this.options = config.options ?? []
        this.permissions = PermissionsBitField.resolve(config.permissions ?? PermissionsBitField.Default).toString() as `${bigint}`
    }

    /**
     * Converts the command to JSON.
     */
    public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        return {
            name: this.name, description: this.description,
            options: this.options, default_member_permissions: this.permissions,
            dm_permission: false
        }
    }
}