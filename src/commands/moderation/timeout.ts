import { PermissionFlagsBits } from 'discord.js'
import ms from 'ms'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR, MS_REGEXP } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'timeout', category: 'moderation',
    description: 'Times {user} out for {length}.',
    memberPerms: [PermissionFlagsBits.ModerateMembers],
    botPerms: [PermissionFlagsBits.ModerateMembers],
    options: [
        new UserOption('target', 'The user to timeout.', { required: true }),
        new StringOption('length', 'The length of the timeout. 30 minutes if left unspecified.'),
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

    let time = length ? ms(length) : 30 * 60 * 1000

    if (time < 0)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` must be a positive value.')] })

    let reason = options.getString('reason') ?? 'No reason provided.'
    
    await target.send({
        embeds: [Embed.case(`You have been timed out from ${guild.name} for ${ms(time, { long: true })}`, reason)]
    })

    let timedOut = await target.timeout(time, reason)
    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Timeout, timedOut.id, member.id, reason)

    await interaction.reply({
        embeds: [Embed.default(`Case #${caseId}: timeout`, `${timedOut} has been timed out for ${ms(time, { long: true })}.`, member.user)]
    })
})