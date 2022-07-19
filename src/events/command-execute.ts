import { Event } from "../Structures/Event"
import { MODERATOR } from '../Util/Permissions'

const COOLDOWNS = new Set<string>()

export default new Event('interactionCreate', async (client, interaction) => {
    if (!interaction.isCommand() || !interaction.inCachedGuild())
        return

    if (COOLDOWNS.has(interaction.member.id))
        return await interaction.reply({ content: 'Solow down there, buddy!', ephemeral: true })

    let command = client.commands.get(interaction.commandName)

    if (!command)
        return await interaction.reply({ content: `Unknown command: \`${interaction.commandName}\`.` })

    try {
        await command.execute(client, interaction)
    } catch (error) {
        await interaction.reply({ content: 'An error occured whilst executing this command.' })
        console.error(error)
    } finally {
        if (interaction.member.permissions.has(MODERATOR))
            return

        COOLDOWNS.add(interaction.member.id)

        setTimeout(() => COOLDOWNS.delete(interaction.member.id), parseInt(process.env.COMMAND_COOLDOWN!) * 1000)
    }
})