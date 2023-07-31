import Event from '../structures/Event'

export default {
	name: 'interactionCreate',

	async emit(client, interaction) {
		if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
			return

		const { commandName, guild } = interaction

		const command = client.commands.get(commandName)

		if (!command) return await interaction.reply({ content: `Unknown command: \`${commandName}\`.`, ephemeral: true })

		let { botPerms, name } = command

		let me = await guild.members.fetchMe()

		if (botPerms && !me.permissions.has(botPerms)) {
			let missing = me.permissions.missing(botPerms)

			return await interaction.reply({ content: `Missing permissions: ${missing.map(perm => `\`${perm.replace(/\B([A-Z])/g, ' $1')}\``)}.`, ephemeral: true })
		}

		try {
			await command.execute(client, interaction)
		} catch (error) {
			console.error(`Error while executing ${name}:`, error)
		}
	}
} as Event<'interactionCreate'>