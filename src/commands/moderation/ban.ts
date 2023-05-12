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

		try {
			await interaction.deferReply()

			const emoji = client.emojis.cache.get('1106557780858515466')!
			const dmEmbed = new EmbedBuilder().setColor(client.color)
				.setTitle(`${emoji} You have been banned from ${interaction.guild.name}!`)
				.setDescription(reason)
				.setTimestamp()
			const replyEmbed = new EmbedBuilder().setColor(client.color)
				.setDescription(`${emoji} ${member} has been banned ${interaction.guild.name}!`)

			await member.send({
				embeds: [dmEmbed.toJSON()]
			})
			await member.ban({ reason, deleteMessageSeconds: 604800 })
			await interaction.editReply({
				embeds: [replyEmbed.toJSON()]
			})
		} catch (error) {
			console.error(error)

			await interaction.deleteReply()
			await interaction.followUp({
				embeds: [
					errorEmbed.setDescription(`I couldn't DM this user.`)
						.toJSON()
				],
				ephemeral: true
			})
		}
	}
} as Command