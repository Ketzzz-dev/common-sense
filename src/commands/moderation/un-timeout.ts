import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { Command } from '../../structs/Command'
import { CommonSenseClient } from '../../structs/CommonSenseClient'

export default {
	name: 'un-timeout', category: 'moderation',
	description: 'Removes a timeout from a user.',

	memberPerms: PermissionFlagsBits.ModerateMembers, botPerms: PermissionFlagsBits.ModerateMembers,
	options: [
		Command.Options.user('user', 'The user to remove a timeout.', { required: true }),
		Command.Options.string('reason', 'The reason of the removal.')
	],

	async execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let { options, member } = interaction

		// getting options
		let user = options.getMember('user')
		let reason = options.getString('reason') ?? 'No reason.'

		// validating options
		if (!user) return 'Unable to find user.'

		// checking permissions
		if (user.id == member.id) return 'You cannot moderate yourself, silly.'
		if (user.id == client.user.id) return 'You cannot moderate me, silly.'
		if (!user.moderatable) return 'I cannot moderate this user.'
		if (member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return 'You cannot moderate members with the same or higher role as you.'

		// double-checking
		if (!user.isCommunicationDisabled()) return 'This user isn\'t in timeout.'

		try {
			let infoEmbed = new EmbedBuilder()
				.setColor(CommonSenseClient.EMBED_COLOR)
				.setDescription(`Removed timeout from ${user}.`)
				.addFields(
					{
						name: 'Reason', inline: true,
						value: codeBlock(reason)
					}
				)

			await interaction.reply({ embeds: [infoEmbed] })
		} catch (error) {
			return 'Unable to DM user but their case was logged.'
		} finally {
			await user.timeout(null, reason)
		}

		return
	}
} as Command