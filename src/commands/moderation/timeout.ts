import { Command } from '../../Structures/Command'
import { MODERATOR } from '../../Util/Permissions'
import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import ms from 'ms'
import GuildEvents from '../../Util/GuildEvents'

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
            name: 'time', description: 'The length of the time out.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'reason', description: 'The reason this user was timed out.'
        }
    ]
}, async (client, interaction) => {
    let { options, guild, user, member } = interaction

    let target = options.getMember('target')
    let time = options.getString('time', true)
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({ content: 'Unknown user.', ephemeral: true })
    else if (target.id == user.id)
        return await interaction.reply({ content: 'You cannot time yourself out, silly.', ephemeral: true })
    else if (target.id == client.user.id)
        return await interaction.reply({ content: 'You cannot time me out, silly.', ephemeral: true })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({ content: 'You cannot time members out with the same or higher permissions as you.', ephemeral: true })

    let timeoutLength
    
    try {
        timeoutLength = ms(time)
    } catch (error) {
        return await interaction.reply({ content: 'Option `time` is invalid.', ephemeral: true })
    }

    await target.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`You were timed out from **${guild.name}** for **${ms(timeoutLength, { long: true })}**!`).setColor('DarkButNotBlack')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `Moderator: ${user.tag}` })
        ]
    })
    await target.timeout(timeoutLength, reason)
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`**${target.user.tag}** was timed out for **${ms(timeoutLength, { long: true })}**!`).setColor('Blue')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `Moderator: ${user.tag}` })
        ]
    })

    GuildEvents.emit('modTimeout', guild, member, target, timeoutLength, reason)
})