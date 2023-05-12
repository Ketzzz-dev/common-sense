import {
	APIApplicationCommandOption,
	PermissionResolvable,
	RESTPostAPIApplicationCommandsJSONBody,
	ApplicationCommandOptionType, APIApplicationCommandOptionChoice,
	APIApplicationCommandBasicOption, ChatInputCommandInteraction,
} from 'discord.js'
import Client from './Client'

interface Command {
	name: string
	description: string

	memberPerms?: PermissionResolvable
	botPerms?: PermissionResolvable
	options?: APIApplicationCommandOption[]

	execute(client: Client, interaction: ChatInputCommandInteraction<'cached'>): Promise<void>
}
namespace Command {
	export function toJSON(command: Command): RESTPostAPIApplicationCommandsJSONBody {
		return {
			name: command.name, description: command.description,
			dm_permission: false, default_member_permissions: command.memberPerms ? `${command.memberPerms}` : null,
			options: command.options
		}
	}
}
export namespace Options {
	export function string(name: string, description: string, required: boolean, minLength?: number, maxLength?: number): APIApplicationCommandBasicOption
	export function string(name: string, description: string, required: boolean, autocomplete?: boolean): APIApplicationCommandBasicOption
	export function string(name: string, description: string, required: boolean, choices: APIApplicationCommandOptionChoice<string>[]): APIApplicationCommandBasicOption
	export function string(name: string, description: string, required: boolean, x?: unknown, y?: number): APIApplicationCommandBasicOption {
		if (typeof x == 'boolean') return {
			type: ApplicationCommandOptionType.String,
			name, description, required, autocomplete: x,
		}
		else if (Array.isArray(x)) return {
			type: ApplicationCommandOptionType.String,
			name, description, required, choices: x
		}
		else return {
				type: ApplicationCommandOptionType.String,
				name, description, required, min_length: x as number, max_length: y
			}
	}

	export function integer(name: string, description: string, required: boolean, minValue?: number, maxValue?: number): APIApplicationCommandBasicOption
	export function integer(name: string, description: string, required: boolean, autocomplete?: boolean): APIApplicationCommandBasicOption
	export function integer(name: string, description: string, required: boolean, choices: APIApplicationCommandOptionChoice<number>[]): APIApplicationCommandBasicOption
	export function integer(name: string, description: string, required: boolean, x?: unknown, y?: number): APIApplicationCommandBasicOption {
		if (typeof x == 'boolean') return {
			type: ApplicationCommandOptionType.Integer,
			name, description, required, autocomplete: x,
		}
		else if (Array.isArray(x)) return {
			type: ApplicationCommandOptionType.Integer,
			name, description, required, choices: x
		}
		else return {
				type: ApplicationCommandOptionType.Integer,
				name, description, required, min_value: x as number, max_value: y
			}
	}

	export function user(name: string, description: string, required: boolean): APIApplicationCommandBasicOption {
		return {
			type: ApplicationCommandOptionType.User,
			name, description, required
		}
	}

	export function subcommand(name: string, description: string, options?: APIApplicationCommandBasicOption[]): APIApplicationCommandOption {
		return {
			type: ApplicationCommandOptionType.Subcommand,
			name, description, options
		}
	}
}

export default Command