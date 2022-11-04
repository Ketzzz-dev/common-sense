import { Command } from '../../structs/Command'
import { CommonSenseClient } from '../../structs/CommonSenseClient'
import { ChatInputCommandInteraction, EmbedBuilder, time } from 'discord.js'

export default {
	name: 'status', category: 'information',
	description: 'Provides an embed of the bots current status.',
	async execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let sent = await interaction.deferReply({ fetchReply: true })

		let embed = new EmbedBuilder()
			.setColor('Fuchsia')
			.addFields(
				{
					name: 'Ping', inline: true,
					value: `API: \`${client.ws.ping} ms\`\nBot: \`${sent.createdTimestamp - interaction.createdTimestamp} ms\``
				},
				{
					name: 'Uptime', inline: true,
					value: time(client.readyAt, 'R')
				}
			)

		await interaction.editReply({ embeds: [embed.toJSON()] })

		return
	}
} as Command