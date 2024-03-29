import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'kick', description: 'Kicks a member.',
	memberPerms: [PermissionsBitField.Flags.KickMembers],
	botPerms: [PermissionsBitField.Flags.KickMembers],
	options: [
		Options.user('member', 'The member to kick.', true),
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
					errorEmbed.setDescription('You can\'t kick yourself, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t kick me, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.roles.highest.position >= interaction.member.roles.highest.position)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t kick members with the same or higher role than you.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (!member.kickable)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I cannot kick this member.')
						.toJSON()
				],
				ephemeral: true
			})


		const emoji = client.emojis.cache.get('1106557780858515466')!

		try {
			await interaction.deferReply()

			const dmEmbed = new EmbedBuilder().setColor(client.color)
				.setTitle(`${emoji} You have been kicked from ${interaction.guild.name}!`)
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
			const kicked = await member.kick(reason)
			const guild = await client.getGuildModel(interaction.guildId)

			guild.cases.push({
				id: guild.nextCaseId,
				reason, user: kicked.id, mod: interaction.member.id,
				action: 'KICK', date: new Date()
			})

			await client.prisma.guild.update({
				where: { id: interaction.guildId },
				data: {
					nextCaseId: { increment: 1 },
					cases: guild.cases
				}
			})

			const replyEmbed = new EmbedBuilder().setColor(client.color)
				.setDescription(`${emoji} ${member} has been kicked!`)
				.setFooter({ text: `Case ID: ${guild.nextCaseId}` })
				.setTimestamp()

			await interaction.editReply({
				embeds: [replyEmbed.toJSON()]
			})
		}
	}
} as Command