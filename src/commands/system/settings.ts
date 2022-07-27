import { PermissionFlagsBits } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'

export default new SlashCommand({
    name: 'settings', category: 'system',
    description: 'Provides a configurable embed of the server settings.',
    memberPerms: PermissionFlagsBits.Administrator,
    options: [

    ]
}, async (client, interaction) => {
    await interaction.reply('unimplemented')
})