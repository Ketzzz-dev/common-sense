import { Colors, EmbedBuilder, Formatters } from 'discord.js'
import ClientEvent from "../../Structures/ClientEvent"
import Logger from '../../Util/Logger'
import Embed from '../../Util/Embed'

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
        return

    let { commandName, guild } = interaction

    let command = client.commandHandler.commands.get(commandName)

    if (!command)
        return await interaction.reply({
            embeds: [Embed.warning(`Unknown command: \`${commandName}\`.`)],
            ephemeral: true
        })

    let { botPerms, name } = command

    let me = await guild.members.fetchMe()

    if (botPerms && !me.permissions.has(botPerms)) {
        let missing = me.permissions.missing(botPerms)

        return await interaction.reply({
            embeds: [Embed.warning(`Missing permissions: ${missing.map(perm => `\`${perm.replace(/\B([A-Z])/g, ' $1')}\``)}.`)],
            ephemeral: true
        })
    }

    try {
        await command.execute(client, interaction)
    } catch (error) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Error while executing ${name}`)
                    .setColor(Colors.Red)
                    .setDescription(Formatters.codeBlock('sh',`${error}`))
                    .setTimestamp()
            ]
        })

        Logger.error('Error while executing %s:', name, error)
    }
})