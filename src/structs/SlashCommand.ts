import {
	APIApplicationCommandOption, APIApplicationCommandOptionChoice,
	ApplicationCommandOptionType,
	ChannelType,
	ChatInputCommandInteraction,
} from 'discord.js'
import { CommonSenseClient } from './CommonSenseClient'

export abstract class SlashCommand {
	private readonly _options: APIApplicationCommandOption[] = []

	public abstract readonly description: string

	protected constructor(public readonly name: string, public readonly category: string) {

	}

	public get options(): ReadonlyArray<APIApplicationCommandOption> {
		return Object.freeze([...this._options])
	}

	protected addOption(option: APIApplicationCommandOption): this {
		this._options.push(option)

		return this
	}

	public abstract execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<void>
}