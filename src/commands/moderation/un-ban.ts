import { ChatInputCommandInteraction, codeBlock, EmbedBuilder, PermissionFlagsBits } from 'discord.js'
import { Command } from '../../structs/Command'
import { CommonSenseClient } from '../../structs/CommonSenseClient'

export default {
	name: 'un-ban', category: 'moderation',
	description: 'Un-bans a user.',

	memberPerms: PermissionFlagsBits.BanMembers, botPerms: PermissionFlagsBits.BanMembers,
	options: [
		Command.Options.user('user', 'The user to un-ban.', { required: true }),
		Command.Options.string('reason', 'The reason of the lift.')
	],

	async execute(client: CommonSenseClient, interaction: ChatInputCommandInteraction<'cached'>): Promise<string | undefined | null> {
		let { options, member, guild } = interaction

		// getting options
		let user = options.getMember('user')
		let reason = options.getString('reason') ?? 'No reason.'

		// validating options
		if (!user) return 'Unable to find user.'

		// checking permissions
		if (user.id == member.id) return 'You cannot ban yourself, silly.'
		if (user.id == client.user.id) return 'You cannot ban me, silly.'
		if (!user.moderatable) return 'I cannot ban this user.'
		if (member.roles.highest.comparePositionTo(user.roles.highest) <= 0) return 'You can\'t ban members with the same or higher role as you.'

		try {
			let infoEmbed = new EmbedBuilder()
				.setColor(CommonSenseClient.EMBED_COLOR)
				.setDescription(`${user} has been un-banned.`)
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
			await guild.members.unban(user, reason)
		}

		return
	}
} as Command