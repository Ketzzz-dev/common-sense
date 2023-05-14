import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'ban', description: 'Bans a member permanently.',
	memberPerms: [PermissionsBitField.Flags.BanMembers],
	options: [
		Options.user('member', 'The member to ban.', true),
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
					errorEmbed.setDescription('You can\'t ban yourself, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t ban me, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (member.roles.highest.position >= interaction.member.roles.highest.position)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You can\'t ban members with the same or higher role than you.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (!member.bannable)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I cannot ban this member.')
						.toJSON()
				],
				ephemeral: true
			})

		const emoji = client.emojis.cache.get('1106557780858515466')!

		try {
			await interaction.deferReply()

			const dmEmbed = new EmbedBuilder().setColor(client.color)
				.setTitle(`${emoji} You have been banned from ${interaction.guild.name}!`)
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
			const banned = await member.ban({ reason, deleteMessageSeconds: 604800 })
			const replyEmbed = new EmbedBuilder().setColor(client.color)
				.setDescription(`${emoji} ${banned} has been banned!`)

			let guild = await client.prisma.guild.findUnique({
				where: { id: interaction.guildId }
			})

			if (!guild)
				guild = await client.prisma.guild.create({
					data: {
						id: interaction.guildId
					}
				})

			guild.cases.push({
				id: guild.nextCaseId,
				reason, user: banned.id, mod: interaction.member.id,
				action: 'BAN'
			})

			await client.prisma.guild.update({
				where: { id: interaction.guildId },
				data: {
					nextCaseId: { increment: 1 },
					cases: guild.cases
				}
			})

			await interaction.editReply({
				embeds: [replyEmbed.toJSON()]
			})
		}
	}
} as Command