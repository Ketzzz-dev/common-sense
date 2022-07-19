import { ApplicationCommandOptionType } from 'discord-api-types/v10'
import { Command } from '../../Structures/Command'
import { MessageEmbed } from 'discord.js'
import { MODERATOR } from '../../Util/Permissions'
import ms from 'ms'

export default new Command({
    name: 'timeout', category: 'moderation',
    description: 'Times `target` out for `time`.',
    permissions: MODERATOR,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target', description: 'The target user to time out.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'time', description: 'The amount of time to time out.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'reason', description: 'The reason this user was timed out.'
        }
    ]
}, async (client, interaction) => {
    let { user: clientUser } = client
    let { options, guild, user: interactionUser } = interaction

    let target = options.getMember('target', true)
    let time = options.getString('time', true)
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (target.id == interactionUser.id)
        return await interaction.reply({ content: 'You cannot time yourself out, silly.', ephemeral: true })
    if (target.id == clientUser.id)
        return await interaction.reply({ content: 'You cannot time me out, silly.', ephemeral: true })
    if (target.permissions.has(MODERATOR))
        return await interaction.reply({ content: 'You cannot time members out with the same or higher permissions as you.', ephemeral: true })
    
    let timeoutLength

    try {
        timeoutLength = ms(time)
    } catch (error) {
        return await interaction.reply({ content: 'Option `time` is invalid.', ephemeral: true })
    }

    await target.send({
        embeds: [
            new MessageEmbed({
                title: `You were timed out in **${guild.name}** for ${ms(timeoutLength, { long: true })}!`, color: 'DARK_BUT_NOT_BLACK',
                description: `**Reason**: ${reason}`,
                footer: { text: `Moderator: ${interactionUser.tag}` }
            })
        ]
    })
    await target.timeout(timeoutLength, reason)
    await interaction.reply({
        embeds: [
            new MessageEmbed({
                title: `**${target.user.tag}** was timed out for ${ms(timeoutLength, { long: true })}!`, color: 'BLUE',
                description: `**Reason**: ${reason}`,
                footer: { text: `Moderator: ${interactionUser.tag}` }
            })
        ]
    })
})