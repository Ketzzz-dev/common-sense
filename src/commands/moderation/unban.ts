import { DocumentType } from '@typegoose/typegoose'
import { PermissionFlagsBits } from 'discord.js'
import GuildCasesModel, { CaseType, GuildCases } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

const CASES_CACHE = new Map<string, DocumentType<GuildCases>>()

export default new SlashCommand({
    name: 'unban', category: 'moderation',
    description: 'Unbans {user}.',
    memberPerms: PermissionFlagsBits.BanMembers,
    botPerms: PermissionFlagsBits.BanMembers,
    options: [
        new UserOption('user', 'The user to unban.', { required: true }),
        new StringOption('reason', 'The reason for this unban.')
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getUser('user', true)

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.id)
        return await interaction.reply({ embeds: [Embed.warning('You\'re not banned, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('I\'m not banned, silly.')], ephemeral: true })

    let bans = await guild.bans.fetch()
    let ban = bans.find(b => b.user.id == user.id)

    if (!ban)
        return await interaction.reply({ embeds: [Embed.warning('This user is not banned.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'

    await guild.bans.remove(ban.user, reason)

    if (!CASES_CACHE.has(guild.id))
        CASES_CACHE.set(guild.id, await GuildCasesModel.get(guild.id))

    let guildCases = CASES_CACHE.get(guild.id)!
    let caseId = await guildCases.addCase(CaseType.Unban, user.id, member.id, reason)

    await interaction.reply({ embeds: [Embed.default(`Case #${caseId}: unban`, `${user} has been unbanned.`, member.user)] })
})