import { PermissionFlagsBits } from 'discord.js'
import ms from 'ms'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR, MS_REGEXP, setLongTimeout } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'ban', category: 'moderation',
    description: 'Bans {user} for {length} or permanently.',
    memberPerms: PermissionFlagsBits.BanMembers,
    botPerms: PermissionFlagsBits.BanMembers,
    options: [
        new UserOption('user', 'The user to ban.', { required: true }),
        new StringOption('length', 'The length of the ban. Permanently if left unspecified.'),
        new StringOption('reason', 'The reason for this ban.') 
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
    else if (user.permissions.has(MODERATOR) && !member.permissions.has(PermissionFlagsBits.Administrator))
        return await interaction.reply({ embeds: [Embed.warning('You can\'t time members out with the same or higher permissions as you.')], ephemeral: true })
    else if (!user.bannable)
        return await interaction.reply({ embeds: [Embed.warning('I can\'t ban this user.')] })

    let length = options.getString('length')

    if (length && !length.match(MS_REGEXP)?.length)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` is invalid. Example: `30s`, `5h`, `1d`')], ephemeral: true })

    let time = length ? ms(length) : null

    if (time && time < 0)
        return await interaction.reply({ embeds: [Embed.warning('Option `length` must be a positive value.')], ephemeral: true })
    if (time && time > 31_557_600_000)
        return await interaction.reply({ embeds: [Embed.warning('A ban must be less than 1 year.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'
    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Ban, user.id, member.id, reason)
    
    try {
        await user.send({
            embeds: [Embed.case(`You have been banned from ${guild.name} ${time ? `for ${ms(time, { long: true })}` : 'permanently'}.`, reason)]
        })
        await interaction.reply({
            embeds: [Embed.default(`Case #${caseId}: timeout`, `${user} has been banned ${time ? `for ${ms(time, { long: true })}` : 'permanently'}.`, member.user)]
        })
    } catch (error) {
        await interaction.reply({ embeds: [Embed.warning('I could\'nt DM this member, but their case was logged.')], ephemeral: true })
    } finally {
        let banned = await user.ban({ reason, deleteMessageDays: 7 })

        if (time)
            setLongTimeout(async () => await guild.bans.remove(banned, 'Time expired.'), time)
    }

})