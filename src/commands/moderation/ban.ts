import { ApplicationCommandOptionType } from 'discord-api-types/v10'
import { MessageEmbed } from 'discord.js'
import { Command } from '../../Structures/Command'
import { MODERATOR } from '../../Util/Permissions'

export default new Command({
    name: 'ban', category: 'moderation',
    description: 'Bans `target` from the server.',
    permissions: MODERATOR,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target', description: 'The target user to ban.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'reason', description: 'The reason this user was banned.'
        }
    ]
}, async (client, interaction) => {
    let { user: clientUser } = client
    let { options, guild, user: interactionUser } = interaction

    let target = options.getMember('target', true)
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (target.id == interactionUser.id)
        return await interaction.reply({ content: 'You cannot ban yourself, silly.', ephemeral: true })
    if (target.id == clientUser.id)
        return await interaction.reply({ content: 'You cannot ban me, silly.', ephemeral: true })
    if (target.permissions.has(MODERATOR))
        return await interaction.reply({ content: 'You cannot ban members with the same or higher permissions as you.', ephemeral: true })
    
    await target.send({
        embeds: [
            new MessageEmbed({
                title: `You were banned in **${guild.name}**!`, color: 'DARK_BUT_NOT_BLACK',
                description: `**Reason**: ${reason}`,
                footer: { text: `Moderator: ${interactionUser.tag}` }
            })
        ]
    })
    await target.ban({ days: 7, reason })
    await interaction.reply({
        embeds: [
            new MessageEmbed({
                title: `**${target.user.tag}** was banned!`, color: 'BLUE',
                description: `**Reason**: ${reason}`,
                footer: { text: `Moderator: ${interactionUser.tag}` }
            })
        ]
    })
})