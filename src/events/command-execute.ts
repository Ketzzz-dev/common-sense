import { Event } from "../Structures/Event";

// cooldowns, because why not?
const COOLDOWNS = new Set<string>()

// command handling.
export default new Event('interactionCreate', async (client, interaction) => {
    // making sure our command is a slash command and it's not in DMs (DM support in the future).
    if (!interaction.isCommand() || !interaction.inCachedGuild())
        return
    
    // if the user is on cooldown, slow down. :)
    if (COOLDOWNS.has(interaction.member.id))
        return await interaction.reply({ content: 'Solow down there, buddy!', ephemeral: true }) // making it ephemeral so that only the user that ran this command can see this.

    // get our command.
    let command = client.commands.get(interaction.commandName)

    // safety check, if we don't have the command registered.
    if (!command)
        return await interaction.reply({ content: `Unknown command: \`${interaction.commandName}\`.` })

    // try-catch for safety.
    try {
        await command.execute(client, interaction)
    } catch (error) { // error catching.
        await interaction.reply({ content: 'An error occured whilst executing this command.' })
        console.error(error)
    } finally { // finally, set a cooldown to keep the user from spamming commands.
        COOLDOWNS.add(interaction.member.id)

        // feel free to change the length of the cooldown in the environment variables.
        setTimeout(() => COOLDOWNS.delete(interaction.member.id), parseInt(process.env.COMMAND_COOLDOWN!) * 1000)
    }
})