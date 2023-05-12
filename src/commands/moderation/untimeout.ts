import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'untimeout', description: 'Removes a timeout from a member.',
	memberPerms: [PermissionsBitField.Flags.ModerateMembers],
	options: [
		Options.user('member', 'The member to warn.', true),
		Options.string('reason', 'The reason.', false, 1)
	],
	async execute(client, interaction) {
		const member = interaction.options.getMember('member')
		const reason = interaction.options.getString('reason') ?? 'No reason.'

		const errorEmbed = new EmbedBuilder()
			.setColor(Colors.Greyple)

		if (!member)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('Member not found.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === interaction.member.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You\'re not timed out, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I\'m not timed out, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.roles.highest.position >= interaction.member.roles.highest.position)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t untime members out with the same or higher role than you.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (!member.moderatable)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I cannot moderate this member.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (!member.isCommunicationDisabled())
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('This member is not timed out.')
						.toJSON()
				],
				ephemeral: true
			})

		await interaction.deferReply()

		const emoji = client.emojis.cache.get('1038962582675001416')!
		const replyEmbed = new EmbedBuilder().setColor(client.color)
			.setDescription(`${emoji} ${member} is off the hook!`)

		await member.timeout(null, reason)
		await interaction.editReply({
			embeds: [replyEmbed.toJSON()]
		})
	}
} as Command