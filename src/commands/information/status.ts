import { EmbedBuilder, time } from 'discord.js'
import Command from '../../structures/Command'

export default {
	name: 'status',
	description: 'Provides an embed of the bot\'s current status.',

	async execute(client, interaction) {
		let deferredMessage = await interaction.deferReply({ fetchReply: true })

		let statusEmbed = new EmbedBuilder()
			.setColor(client.color)
			.addFields(
				{
					name: 'Ping', inline: true,
					value: `API: \`${client.ws.ping} ms\`\nBot: \`${deferredMessage.createdTimestamp - interaction.createdTimestamp} ms\``
				},
				{
					name: 'Uptime', inline: true,
					value: time(client.readyAt, 'R')
				}
			)

		await interaction.editReply({ embeds: [statusEmbed.toJSON()] })
	}
} as Command