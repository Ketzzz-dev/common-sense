import { ClientEvent } from '../../structs/ClientEvent'
import { Logger } from '../../util/Logger'

export default {
	name: 'interactionCreate',

	async emit(client, interaction): Promise<any> {
		if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
			return

		let { commandName, guild } = interaction

		let command = client.commands.get(commandName)

		if (!command) return await interaction.reply({ content: `Unknown command: \`${commandName}\`.`, ephemeral: true })

		let { botPerms, name } = command

		let me = await guild.members.fetchMe()

		if (botPerms && !me.permissions.has(botPerms)) {
			let missing = me.permissions.missing(botPerms)

			return await interaction.reply({ content: `Missing permissions: ${missing.map(perm => `\`${perm.replace(/\B([A-Z])/g, ' $1')}\``)}.`, ephemeral: true })
		}

		try {
			let error = await command.execute(client, interaction)

			if (error) {
				return await interaction.reply({ content: error, ephemeral: true })
			}
		} catch (error) {
			// TODO: har har...
			// await sendWebhook(client.user, channel as TextChannel, {
			// 	embeds: [Embeds.error(command.name, error)]
			// })

			Logger.error(`Error while executing ${name}:`, error)
		}
	}
} as ClientEvent<'interactionCreate'>