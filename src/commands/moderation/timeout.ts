import { DocumentType } from '@typegoose/typegoose'
import { PermissionFlagsBits } from 'discord.js'
import ms from 'ms'
import GuildCasesModel, { CaseType, GuildCases } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR, MS_REGEXP } from '../../Util/Common'
import Embed from '../../Util/Embed'

const CASES_CACHE = new Map<string, DocumentType<GuildCases>>()

export default new SlashCommand({
    name: 'timeout', category: 'moderation',
    description: 'Times {user} out for {length}.',
    memberPerms: [PermissionFlagsBits.ModerateMembers],
    botPerms: [PermissionFlagsBits.ModerateMembers],
    options: [
        new UserOption('user', 'The user to timeout.', { required: true }),
        new StringOption('length', 'The length of the timeout. 30 minutes if left unspecified.'),
        new StringOption('reason', 'The reason for this timeout.')  
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getMember('user')

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time yourself out, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time me out, silly.')], ephemeral: true })
    else if (user.permissions.has(MODERATOR))
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time members out with the same or higher permissions as you.')], ephemeral: true })
    else if (!user.moderatable)
        return await interaction.reply({ embeds: [Embed.warning('I can\'t timeout this user.')] })

    let length = options.getString('length')

    if (length && !length.match(MS_REGEXP)?.length)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` is invalid. Example: `30s`, `5h`, `1d`')], ephemeral: true })

    let time = length ? ms(length) : 1_800_000

    if (time < 0)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` must be a positive value.')], ephemeral: true })
    if (time > 2_419_200_000)
        return await interaction.reply({ embeds: [Embed.warning('A timeout must be less than 28 days.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!CASES_CACHE.has(guild.id))
        CASES_CACHE.set(guild.id, await GuildCasesModel.get(guild.id))

    let guildCases = CASES_CACHE.get(guild.id)!
    let caseId = await guildCases.addCase(CaseType.Timeout, user.id, member.id, reason)
    
    try {
        await user.send({
            embeds: [Embed.case(`You have been timed out from ${guild.name} for ${ms(time, { long: true })}.`, reason)]
        })
        await interaction.reply({
            embeds: [Embed.default(`Case #${caseId}: timeout`, `${user} has been timed out for ${ms(time, { long: true })}.`, member.user)]
        })
    } catch (error) {
        await interaction.reply({ embeds: [Embed.warning('I could\'nt DM this member, but their case was logged.')], ephemeral: true })
    } finally {
        await user.timeout(time, reason)
    }
})