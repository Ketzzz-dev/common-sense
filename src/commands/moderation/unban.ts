import { Colors, EmbedBuilder, PermissionsBitField } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'unban', description: 'Unbans a user.',
	memberPerms: [PermissionsBitField.Flags.BanMembers],
	options: [
		Options.user('user', 'The user to unban.', true),
		Options.string('reason', 'The reason.', false, 1)
	],
	async execute(client, interaction) {
		const user = interaction.options.getUser('user', true)
		const reason = interaction.options.getString('reason') ?? 'No reason.'

		const errorEmbed = new EmbedBuilder()
			.setColor(Colors.Greyple)

		if (user.id === interaction.member.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('You\'re not banned, silly.')
						.toJSON()
				],
				ephemeral: true
			})
		else if (user.id === client.user.id)
			return await interaction.reply({
				embeds: [
					errorEmbed.setDescription('I\'m not banned, silly.')
						.toJSON()
				],
				ephemeral: true
			})

		await interaction.deferReply()

		const emoji = client.emojis.cache.get('1106557780858515466')!
		const replyEmbed = new EmbedBuilder().setColor(client.color)
			.setDescription(`${emoji} ${user} is off the hook!`)

		await interaction.guild.members.unban(user, reason)
		await interaction.editReply({
			embeds: [replyEmbed.toJSON()]
		})
	}
} as Command