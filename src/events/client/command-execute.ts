import { Colors, EmbedBuilder, Formatters } from 'discord.js'
import ClientEvent from "../../Structures/ClientEvent"
import Logger from '../../Util/Logger'
import Embed from '../../Util/Embed'
import { toTitleCase } from '../../Util/Common'

// const COOLDOWNS = new Set<string>()

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
        return

    let { member, commandName, guild } = interaction

    // if (COOLDOWNS.has(member.id))
    //     return await interaction.reply({
    //         embeds: [Embed.warning('Slow down there, buddy.')],
    //         ephemeral: true
    //     })

    let command = client.commandHandler.commands.get(commandName)

    if (!command)
        return await interaction.reply({
            embeds: [Embed.warning(`Unknown command: \`${commandName}\`.`)],
            ephemeral: true
        })

    let { botPerms, name } = command

    if (botPerms && !member.permissions.has(botPerms)) {
        let me = await guild.members.fetchMe()
        let missing = me.permissions.missing(botPerms)

        return await interaction.reply({
            embeds: [Embed.warning(`Missing permissions: ${missing.map(perm => `${toTitleCase(perm)}`).join(', ')}`)],
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
    } finally {
        // COOLDOWNS.add(member.id)

        // setTimeout(() => COOLDOWNS.delete(member.id), 3000)
    }
})