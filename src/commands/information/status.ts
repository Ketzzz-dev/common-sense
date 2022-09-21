import { Command } from '../../structs/Command'
import { Client } from '../../structs/Client'
import { ChatInputCommandInteraction, EmbedBuilder, time } from 'discord.js'

export default {
	name: 'status', category: 'information',
	description: 'Provides an embed of the bots current status.',
	async execute(client: Client, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let sent = await interaction.deferReply({ fetchReply: true })

		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setColor('Fuchsia')
					.addFields(
						{
							name: 'Ping', inline: true,
							value: `API: \`${client.ws.ping} ms\`, Bot: \`${sent.createdTimestamp - interaction.createdTimestamp} ms\``
						},
						{
							name: 'Uptime', inline: true,
							value: time(client.readyAt, 'R')
						}
					)
			]
		})

		return
	}
} as Command