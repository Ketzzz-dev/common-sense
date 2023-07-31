import { APIEmbedField, Colors, EmbedBuilder, PermissionsBitField, userMention } from 'discord.js'
import Command, { Options } from '../../structures/Command'

export default {
	name: 'cases', description: 'Manage the server\'s cases.',
	memberPerms: [PermissionsBitField.Flags.ManageGuild],
	options: [
		Options.subcommand('list', 'Provides a list of the server\'s cases.'),
		Options.subcommand('get', 'View a case from the specified ID.', [
			Options.integer('id', 'The ID of the case to get.', true, 1)
		]),
		Options.subcommand('delete', 'Deletes a case.', [
			Options.integer('id', 'The ID of the case to delete.', true, 1)
		]),
		Options.subcommand('member', 'Views the cases of a server member.', [
			Options.user('member', 'The member to view.', true)
		])
	],

	async execute(client, interaction) {
		const subcommand = interaction.options.getSubcommand(true)
		const guild = await client.getGuildModel(interaction.guildId)
		const replyEmbed = new EmbedBuilder()

		switch (subcommand) {
			case 'list':
				await interaction.reply({ content: 'TODO...', ephemeral: true })

				break
			case 'get': {
				const id = interaction.options.getInteger('id', true)
				const $case = guild.cases.find(c => c.id == id)

				if (!$case) {
					replyEmbed.setColor(Colors.Greyple)
						.setDescription('There is no case logged with that ID.')

					await interaction.reply({
						embeds: [replyEmbed.toJSON()],
						ephemeral: true,
					})

					break
				}

				replyEmbed.setColor(client.color)
					.setTitle(`Case #${id}`)
					.addFields(
						{
							name: 'Reason', inline: false,
							value: $case.reason,
						},
						{
							name: 'Action', inline: true,
							value: `\`${$case.action}\``,
						},
						{
							name: 'User', inline: true,
							value: userMention($case.user),
						},
						{
							name: 'Mod', inline: true,
							value: userMention($case.mod),
						},
					)
					.setTimestamp($case.date)

				await interaction.reply({ embeds: [replyEmbed.toJSON()] })

				break
			}
			case 'delete': {
				const id = interaction.options.getInteger('id', true)
				const $case = guild.cases.find(c => c.id == id)

				if (!$case) {
					replyEmbed.setColor(Colors.Greyple)
						.setDescription('There is no case logged with that ID.')

					await interaction.reply({
						embeds: [replyEmbed.toJSON()],
						ephemeral: true,
					})

					break
				}

				await client.prisma.guild.update({
					where: { id: interaction.guildId },
					data: {
						cases: guild.cases.splice(guild.cases.findIndex(c => c.id == id), 1)
					}
				})

				replyEmbed.setColor(client.color)
					.setDescription(':no_entry_sign: Case deleted.')
					.setTimestamp()

				await interaction.reply({ embeds: [replyEmbed.toJSON()] })

				break
			}
			case 'member': {
				const member = interaction.options.getMember('member')

				if (!member) {
					await interaction.reply({
						embeds: [
							replyEmbed.setColor(Colors.Greyple)
								.setDescription('Member not found.')
								.toJSON(),
						],
						ephemeral: true,
					})

					break
				}

				const cases = guild.cases.filter(c => c.user === member.id)

				if (!cases.length) {
					await interaction.reply({
						embeds: [
							replyEmbed.setColor(Colors.Greyple)
								.setDescription('There are no cases logged for this member.')
								.toJSON(),
						],
						ephemeral: true,
					})

					break
				}

				replyEmbed.setColor(client.color)
					.setTitle(`Cases of ${member.user.tag}`)
					.addFields(cases.map(c => ({ name: `Case #${c.id}`, value: c.reason })))

				await interaction.reply({ embeds: [replyEmbed.toJSON()] })

				break
			}
		}
	}
} as Command