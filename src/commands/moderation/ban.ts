import { Formatters } from 'discord.js'
import ms from 'ms'
import Command from '../../Structures/Command'
import { StringOption, UserOption } from '../../Structures/CommandOptions'
import { MODERATOR, setLongTimeout } from '../../Util/Common'
import CustomEventHandler from '../../Util/CustomEventHandler'
import { createDefaultEmbed, createWarnEmbed } from '../../Util/Embeds'

export default new Command({
    name: 'ban', category: 'moderation',
    description: 'Bans `target` from the server.',
    permissions: MODERATOR,
    options: [
        new UserOption('target', 'The target user to ban.', true),
        new StringOption('time', 'The length of the ban. `-` to ban permanently.', true),
        new StringOption('reason', 'The reason this user was banned.')
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    let target = options.getMember('target')
    let time = options.getString('time', true)
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({
            embeds: [createWarnEmbed('Unknown user.')],
            ephemeral: true
        })
    else if (target.id == user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot ban yourself, silly.')],
            ephemeral: true
        })
    else if (target.id == client.user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot ban me, silly.')],
            ephemeral: true
        })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot ban members with the same or higher permissions as you.')],      
            ephemeral: true
        })

    let banLength
    
    try {
        banLength = time == '-' ? '-' : ms(time)
    } catch (error) {
        return await interaction.reply({ embeds: [createWarnEmbed('Option `time` is invalid.')], ephemeral: true })
    }

    let longBan = typeof banLength == 'string' ? 'permanently' : `for **${ms(banLength, { long: true })}**`

    await target.send({
        embeds: [createDefaultEmbed(`You were banned from ${guild.name} ${longBan}`, Formatters.codeBlock(reason), user)]
    })

    let banned = await target.ban({ deleteMessageDays: 7, reason })

    await interaction.reply({
        embeds: [createDefaultEmbed(`${banned.user.tag} was banned ${longBan}!`, Formatters.codeBlock(reason), user)]
    })

    if (typeof banLength == 'number')
        setLongTimeout(() => guild.members.unban(banned.id), banLength)

    CustomEventHandler.emit('ban', client.user, guild, user, target.user, longBan, reason)
})