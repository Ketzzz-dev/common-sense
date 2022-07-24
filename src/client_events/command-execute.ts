import { Formatters } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import ClientEvent from "../Structures/ClientEvent"
import { MODERATOR } from '../Util/Common'

const COOLDOWNS = new Set<string>()

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild())
        return
    if (COOLDOWNS.has(interaction.member.id))
        return await interaction.reply({ content: 'Slow down there, buddy!', ephemeral: true })

    let command = client.commandHandler.commands.get(interaction.commandName)

    if (!command)
        return await interaction.reply({ content: `Unknown command: \`${interaction.commandName}\`.`, ephemeral: true })
    
    let isStaff = interaction.member.permissions.has(MODERATOR, true)
    let settings = await GuildSettingsModel.get(interaction.guildId)

    if (settings.commands.get(interaction.commandName) === false)
        return await interaction.reply({ content: 'This command is disabled in this server.', ephemeral: true })
    if (settings.channels.botSpam && interaction.channelId != settings.channels.botSpam && !isStaff)
        return await interaction.reply({ content: `This command can only be executed in ${Formatters.channelMention(settings.channels.botSpam)}.`, ephemeral: true })

    try {
        await command.execute(client, interaction)
    } catch (error) {
        await interaction.reply({ content: 'An error occured whilst executing this command.', ephemeral: true })

        console.error(error)
    } finally {
        if (isStaff)
            return

        COOLDOWNS.add(interaction.member.id)

        setTimeout(() => COOLDOWNS.delete(interaction.member.id), parseInt(process.env.COMMAND_COOLDOWN!) * 1000)
    }
})