import { Command } from '../../structs/Command'
import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { CommonSenseClient } from '../../structs/CommonSenseClient'

export default {
	name: 'warn', category: 'moderation',
	description: 'Warns a user.',

	memberPerms: PermissionFlagsBits.ModerateMembers,
	options: [
		Command.Options.user('user', 'The user to warn.', { required: true }),
		Command.Options.string('reason', 'The reason of the warn.')
	],

	async execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let { options, member, guild } = interaction

		// getting options
		let user = options.getMember('user')
		let reason = options.getString('reason') ?? 'No reason.'

		// validating options
		if (!user) return 'Unable to find user.'

		// checking permissions
		if (user.id == member.id) return 'You cannot moderate yourself, silly.'
		if (user.id == client.user.id) return 'You cannot moderate me, silly.'
		if (!user.moderatable) return 'I cannot moderate this user.'
		if (member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return 'You can\'t moderate members with the same or higher role as you.'

		try {
			let infoEmbed = new EmbedBuilder()
				.setColor(CommonSenseClient.EMBED_COLOR)
				.setDescription(`${user} has been warned.`)
				.addFields(
					{
						name: 'Reason', inline: true,
						value: codeBlock(reason)
					}
				)
			let dmEmbed = new EmbedBuilder()
				.setColor('Red')
				.setDescription(`You have been warned in ${guild}.`)
				.addFields(
					{
						name: 'Reason', inline: true,
						value: codeBlock(reason)
					}
				)

			await interaction.reply({ embeds: [infoEmbed] })
			await user.send({ embeds: [dmEmbed] })
		} catch (error) {
			return 'Unable to DM user but their case was logged.'
		}

		return
	}
} as Command