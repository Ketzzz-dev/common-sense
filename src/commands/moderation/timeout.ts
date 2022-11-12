import { Command } from '../../structs/Command'
import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, PermissionFlagsBits, time } from 'discord.js'
import { CommonSenseClient } from '../../structs/CommonSenseClient'
import { MS_REGEXP } from '../../util/Common'
import ms from 'ms'

const THIRTY_MINS = ms('30m')
const MAX_TIMEOUT_LEN = ms('28d')

export default {
	name: 'timeout', category: 'moderation',
	description: 'Timeouts a user for a period of time.',

	memberPerms: PermissionFlagsBits.ModerateMembers, botPerms: PermissionFlagsBits.ModerateMembers,
	options: [
		Command.Options.user('user', 'The user to timeout.', { required: true }),
		Command.Options.string('length', 'The length of the timeout, 30m by default.'),
		Command.Options.string('reason', 'The reason of the timeout.')
	],

	async execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let { options, member, guild } = interaction

		// getting options
		let user = options.getMember('user')
		let length = options.getString('length')
		let reason = options.getString('reason') ?? 'No reason.'

		// validating options
		if (!user) return 'Unable to find user.'
		if (length && !length.match(MS_REGEXP)) return 'Invalid string option, \'length\' must be ms parsable (ex: `60s`, `5m`, `1h`).'

		let timeout = length ? ms(length) : THIRTY_MINS

		if (timeout < 0) return 'Invalid string option, \'length\' cannot be negative.'
		if (timeout > MAX_TIMEOUT_LEN) return 'Invalid string option, \'length\' cannot be more than 28 days.'

		// checking permissions
		if (user.id == member.id) return 'You cannot moderate yourself, silly.'
		if (user.id == client.user.id) return 'You cannot moderate me, silly.'
		if (!user.moderatable) return 'I cannot moderate this user.'
		if (member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return 'You can\'t moderate members with the same or higher role as you.'

		try {
			let timeValue = `Length: \`${ms(timeout, { long: true })}\`\nUntil: ${time(new Date(Date.now() + timeout), 'F')}`

			let infoEmbed = new EmbedBuilder()
				.setColor(CommonSenseClient.EMBED_COLOR)
				.setDescription(`${user} has been timed out.`)
				.addFields(
					{
						name: 'Time', inline: true,
						value: timeValue
					},
					{
						name: 'Reason', inline: true,
						value: codeBlock(reason)
					}
				)
			let dmEmbed = new EmbedBuilder()
				.setColor('Red')
				.setDescription(`You have been timed out from ${guild}.`)
				.addFields(
					{
						name: 'Time', inline: true,
						value: timeValue
					},
					{
						name: 'Reason', inline: true,
						value: codeBlock(reason)
					}
				)

			await interaction.reply({ embeds: [infoEmbed] })
			await user.send({ embeds: [dmEmbed] })
		} catch (error) {
			return 'Unable to DM user but their case was logged.'
		} finally {
			await user.timeout(timeout, reason)
		}

		return
	}
} as Command