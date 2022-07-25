import { Colors, EmbedBuilder, Formatters } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import ClientEvent from "../Structures/ClientEvent"
import Logger from '../Structures/Logger'
import { MODERATOR } from '../Util/Common'
import { createWarnEmbed } from '../Util/Embeds'

const COOLDOWNS = new Set<string>()

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
        return

    let { member, commandName, guildId, channelId } = interaction

    if (COOLDOWNS.has(member.id))
        return await interaction.reply({
            embeds: [createWarnEmbed('Slow down there, buddy.')],
            ephemeral: true
        })

    let command = client.commandHandler.commands.get(commandName)

    if (!command)
        return await interaction.reply({
            embeds: [createWarnEmbed(`Unknown command: \`${commandName}\`.`)],
            ephemeral: true
    })
    
    let isStaff = member.permissions.has(MODERATOR, true)
    let settings = await GuildSettingsModel.get(guildId)

    if (settings.commands.get(commandName) === false)
        return await interaction.reply({
            embeds: [createWarnEmbed('This command is disabled in this server.')],
            ephemeral: true 
        })
    if (settings.channels.botSpam && channelId != settings.channels.botSpam && !isStaff)
        return await interaction.reply({
            embeds: [createWarnEmbed(`This command can only be executed in ${Formatters.channelMention(settings.channels.botSpam)}.`)],
            ephemeral: true
        })

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

        setTimeout(() => COOLDOWNS.delete(member.id), parseInt(process.env.COMMAND_COOLDOWN!) * 1000)
    }
})