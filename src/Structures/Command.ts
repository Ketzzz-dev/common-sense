import { PermissionsBitField, APIApplicationCommandOption, PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody, ChatInputCommandInteraction } from "discord.js"
import CommonSenseClient from "./CommonSenseClient"

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
    private readonly options?: APIApplicationCommandOption[]
    private readonly permissions?: bigint

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

        if (config.options)
            this.options = config.options
        if (config.permissions)
            this.permissions = PermissionsBitField.resolve(config.permissions)
    }

    /**
     * Converts the command to JSON.
     */
    public toJSON(): RESTPostAPIApplicationCommandsJSONBody {
        let json: RESTPostAPIApplicationCommandsJSONBody = {
            name: this.name, description: this.description,
            dm_permission: false
        }

        if (this.options)
            json.options = [...this.options]
        if (this.permissions)
            json.default_member_permissions = `${this.permissions}`

        return json
    }
}