import { InteractionType } from 'discord.js'
import ClientEvent from '../../Structures/ClientEvent'

export default new ClientEvent('interactionCreate', async (client, interaction) => {
    if (interaction.type != InteractionType.ApplicationCommandAutocomplete) return

    switch (interaction.commandName) {
        case 'commands': {
            let focused = interaction.options.getFocused()
            let choices = [...client.commandHandler.commands.keys()]

            await interaction.respond(
                choices.filter(c => c.startsWith(focused))
                    .map(c => ({ name: c, value: c }))
            )
        }
    }
})