import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import ms from 'ms'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'timeout', description: 'Times a member out and deducts their reputation.',
	memberPerms: [PermissionsBitField.Flags.ModerateMembers],
	botPerms: [PermissionsBitField.Flags.ModerateMembers],
	options: [
		Options.user('member', 'The member to timeout.', true),
		Options.string('length', 'The duration of the timeout.', true),
		Options.string('reason', 'The reason.', false, 1)
	],
	async execute(client, interaction) {
		const member = interaction.options.getMember('member')
		const length = interaction.options.getString('length', true)
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
					errorEmbed.setDescription('You can\'t time yourself out, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t time me out, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.roles.highest.position >= interaction.member.roles.highest.position)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t time members out with the same or higher role than you.')
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

		const time = ms(length)

		if (time === undefined)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('Option "length" is invalid; example: `30s`, `5m`, `6h`, `3d`, `1w`.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (time < 1000)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('Option "length" is invalid; cannot be less than 1 second.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (time > ms('28d'))
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('Option "length" is invalid; cannot be greater than 28 days.')
						.toJSON()
				],
				ephemeral: true
			})

		const duration = ms(time, { long: true })
		const emoji = client.emojis.cache.get('1038962582675001416')!

		try {
			await interaction.deferReply()

			const dmEmbed = new EmbedBuilder().setColor(client.color)
				.setTitle(`${emoji} You have been timed out in ${interaction.guild.name} for ${duration}!`)
				.setDescription(reason)
				.setTimestamp()

			await member.send({
				embeds: [dmEmbed.toJSON()]
			})
		} catch (error) {
			console.error(error)

			await interaction.followUp({
				embeds: [
					errorEmbed.setDescription(`I couldn't DM this user, but their case was logged.`)
						.toJSON()
				],
				ephemeral: true
			})
		} finally {
			const timed = await member.timeout(time, reason)
			const guild = await client.getGuildModel(interaction.guildId)

			guild.cases.push({
				id: guild.nextCaseId,
				reason, user: timed.id, mod: interaction.member.id,
				action: 'TIMEOUT', date: new Date()
			})

			await client.prisma.guild.update({
				where: { id: interaction.guildId },
				data: {
					nextCaseId: { increment: 1 },
					cases: guild.cases
				}
			})

			const replyEmbed = new EmbedBuilder().setColor(client.color)
				.setDescription(`${emoji} ${member} has been timed out for ${duration}!`)
				.setFooter({ text: `Case ID: ${guild.nextCaseId}` })
				.setTimestamp()

			await interaction.editReply({
				embeds: [replyEmbed.toJSON()]
			})
		}
	}
} as Command