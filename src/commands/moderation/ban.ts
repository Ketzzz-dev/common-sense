import { PermissionFlagsBits } from 'discord.js'
import ms from 'ms'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR, MS_REGEXP, setLongTimeout } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'ban', category: 'moderation',
    description: 'Bans {target} for {length} or permanently.',
    memberPerms: [PermissionFlagsBits.BanMembers],
    botPerms: [PermissionFlagsBits.BanMembers],
    options: [
        new UserOption('target', 'The user to timeout.', { required: true }),
        new StringOption('length', 'The length of the timeout. Permanently if left unspecified.'),
        new StringOption('reason', 'The reason for this timeout.') 
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let target = options.getMember('target')

    if (!target)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (target.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time yourself out, silly.')] })
    else if (target.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time me out, silly.')] })
    else if (target.permissions.has(MODERATOR) && target.roles.highest.position >= member.roles.highest.position)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time members out with the same or higher permissions as you.')] })

    let length = options.getString('length')

    if (length && !length.match(MS_REGEXP))
        return await interaction.reply({ embeds: [Embed.warning('Option `length` is invalid. Example: `30s`, `2h`, `1d`')] })

    let time = length ? ms(length) : null

    if (time && time < 0)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` must be a positive value.')] })

    let reason = options.getString('reason') ?? 'No reason provided.'
    
    await target.send({
        embeds: [Embed.case(`You have been banned from ${guild.name} ${time ? `for ${ms(time, { long: true })}` : 'permanently'}`, reason)]
    })

    let banned = await target.ban({ deleteMessageDays: 7, reason })

    await interaction.reply({
        embeds: [Embed.case(`${banned.user.tag} has been banned ${time ? `for ${ms(time, { long: true })}` : 'permanently'}.`, reason)]
    })

    if (time)
        setLongTimeout(async () => await guild.members.unban(banned, 'Ban time expired.'), time)
})