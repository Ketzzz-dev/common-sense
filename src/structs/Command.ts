import {CommonSenseClient} from './CommonSenseClient'
import {
    APIApplicationCommandAttachmentOption,
    APIApplicationCommandBooleanOption,
    APIApplicationCommandChannelOption,
    APIApplicationCommandIntegerOption,
    APIApplicationCommandMentionableOption,
    APIApplicationCommandStringOption,
    APIApplicationCommandOption,
    APIApplicationCommandOptionChoice,
    ApplicationCommandOptionType, ApplicationCommandUserOption,
    ChannelType,
    ChatInputCommandInteraction,
    PermissionResolvable, RESTPostAPIApplicationCommandsJSONBody
} from 'discord.js'

export interface Command {
    readonly name: string
    readonly category: string
    readonly description: string

    options?: APIApplicationCommandOption[]
    memberPerms?: PermissionResolvable
    botPerms?: PermissionResolvable

    execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null>
}
export module Command {
    export function toJSON(command: Command): RESTPostAPIApplicationCommandsJSONBody {
        let json: RESTPostAPIApplicationCommandsJSONBody = {
            name: command.name, description: command.description,
            options: command.options ?? [], dm_permission: false
        }

        if (command.memberPerms)
            json.default_member_permissions = `${command.memberPerms}`

        return json
    }
}
export module Command.Options {
    interface OptionConfig {
        required?: boolean
    }
    interface ChoicesOptionConfig<T extends string | number> extends OptionConfig {
        choices: APIApplicationCommandOptionChoice<T>[]
    }
    interface AutocompleteOptionConfig extends OptionConfig {
        autocomplete?: true
    }
    interface ChannelOptionConfig extends OptionConfig {
        channelTypes?: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>[]
    }
    interface IntegerOptionConfig extends OptionConfig {
        minValue?: number
        maxValue?: number
    }
    interface StringOptionConfig extends OptionConfig {
        minLength?: number
        maxLength?: number
    }

    export function attachment(name: string, description: string, config?: OptionConfig): APIApplicationCommandAttachmentOption {
        return {
            type: ApplicationCommandOptionType.Attachment,
            name, description, required: config?.required
        }
    }
    export function boolean(name: string, description: string, config?: OptionConfig): APIApplicationCommandBooleanOption {
        return {
            type: ApplicationCommandOptionType.Boolean,
            name, description, required: config?.required
        }
    }
    export function channel(name: string, description: string, config?: ChannelOptionConfig):APIApplicationCommandChannelOption {
        return {
            type: ApplicationCommandOptionType.Channel,
            name, description, required: config?.required,
            channel_types: config?.channelTypes
        }
    }
    export function integer(name: string, description: string, config?: IntegerOptionConfig & (ChoicesOptionConfig<number> | AutocompleteOptionConfig)): APIApplicationCommandIntegerOption {
        let option: APIApplicationCommandIntegerOption = {
            type: ApplicationCommandOptionType.Integer,
            name, description, required: config?.required,
            min_value: config?.minValue, max_value: config?.maxValue
        }

        if (config && Object.hasOwn(config, 'choices'))
            option.choices = (config as ChoicesOptionConfig<number>).choices
        else if (config && Object.hasOwn(config, 'autocomplete'))
            option.autocomplete = (config as AutocompleteOptionConfig).autocomplete as false

        return option
    }
    export function mentionable(name: string, description: string, config?: OptionConfig): APIApplicationCommandMentionableOption {
        return {
            type: ApplicationCommandOptionType.Mentionable,
            name, description, required: config?.required
        }
    }
    export function user(name: string, description: string, config?: OptionConfig): ApplicationCommandUserOption {
        return {
            type: ApplicationCommandOptionType.User,
            name, description, required: config?.required
        }
    }
    export function string(name: string, description: string, config?: StringOptionConfig & (ChoicesOptionConfig<string> | AutocompleteOptionConfig)): APIApplicationCommandStringOption {
        let option: APIApplicationCommandStringOption = {
            type: ApplicationCommandOptionType.String,
            name, description, required: config?.required,
            min_length: config?.minLength, max_length: config?.maxLength
        }

        if (config && Object.hasOwn(config, 'choices'))
            option.choices = (config as ChoicesOptionConfig<string>).choices
        else if (config && Object.hasOwn(config, 'autocomplete'))
            option.autocomplete = (config as AutocompleteOptionConfig).autocomplete as false

        return option
    }
}
