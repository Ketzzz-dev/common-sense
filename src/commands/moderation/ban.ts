import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, PermissionFlagsBits, time } from 'discord.js'
import ms from 'ms'
import { Command } from '../../structs/Command'
import { CommonSenseClient } from '../../structs/CommonSenseClient'
import { MS_REGEXP } from '../../util/Common'
import { setTimeout } from 'long-timeout'

const MAX_BAN_LENGTH = ms('1y')

export default {
	name: 'ban', category: 'moderation',
	description: 'Bans a user indefinitely or for a period of time.',

	memberPerms: PermissionFlagsBits.BanMembers, botPerms: PermissionFlagsBits.BanMembers,
	options: [
		Command.Options.user('user', 'The user to ban.', { required: true }),
		Command.Options.string('length', 'The length of the ban, permanent by default.'),
		Command.Options.string('reason', 'The reason of the ban.')
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

		let timeout = length ? ms(length) : null

		if (timeout && timeout < 0) return 'Invalid string option, \'length\' cannot be negative.'
		if (timeout && timeout > MAX_BAN_LENGTH) return 'Invalid string option, \'length\' cannot be more than a year.'

		// checking permissions
		if (user.id == member.id) return 'You cannot ban yourself, silly.'
		if (user.id == client.user.id) return 'You cannot ban me, silly.'
		if (!user.moderatable) return 'I cannot ban this user.'
		if (member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return 'You can\'t ban members with the same or higher role as you.'

		try {
			let timeValue = timeout ? `Length: \`${ms(timeout, { long: true })}\`\nUntil: ${time(new Date(Date.now() + timeout), 'F')}` : 'Indefinite'

			let infoEmbed = new EmbedBuilder()
				.setColor(CommonSenseClient.EMBED_COLOR)
				.setDescription(`${user} has been banned.`)
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
				.setDescription(`You have been banned from ${guild}.`)
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
			let banned = await user.ban({ reason, deleteMessageDays: 7 })

			if (timeout) setTimeout(() => guild.members.unban(banned, 'time expired'), timeout)
		}

		return
	}
} as Command