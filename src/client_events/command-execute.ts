import { Colors, EmbedBuilder, Formatters } from 'discord.js'
import ClientEvent from "../Structures/ClientEvent"
import Logger from '../Util/Logger'
import { MODERATOR } from '../Util/Common'
import Embed from '../Util/Embed'

const COOLDOWNS = new Set<string>()

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
        return

    let { member, commandName, guildId, channelId } = interaction

    if (COOLDOWNS.has(member.id))
        return await interaction.reply({
            embeds: [Embed.warning('Slow down there, buddy.')],
            ephemeral: true
        })

    let command = client.commandHandler.commands.get(commandName)

    if (!command)
        return await interaction.reply({
            embeds: [Embed.warning(`Unknown command: \`${commandName}\`.`)],
            ephemeral: true
    })
    
    let isStaff = member.permissions.has(MODERATOR, true)

    try {
        await command.execute(client, interaction)
    } catch (error) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`Error while executing ${command.name}`)
                    .setColor(Colors.Red)
                    .setDescription(Formatters.codeBlock('sh',`${error}`))
                    .setTimestamp()
            ]
        })

        Logger.error('Error while executing %s:', command.name, error)
    } finally {
        if (isStaff)
            return

        COOLDOWNS.add(member.id)

        setTimeout(() => COOLDOWNS.delete(member.id), 3000)
    }
})