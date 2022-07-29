import { PermissionFlagsBits } from 'discord.js'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'warn', category: 'moderation',
    description: 'Warns {user}.',
    memberPerms: [PermissionFlagsBits.ModerateMembers],
    options: [
        new UserOption('user', 'The user to warn.', { required: true }),
        new StringOption('reason', 'The reason for this warn.') 
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getMember('user')

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn yourself, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn me, silly.')], ephemeral: true })
    else if (user.permissions.has(MODERATOR))
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn members with the same or higher permissions as you.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'
    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Warn, user.id, member.id, reason)
    
    try {
        await user.send({
            embeds: [Embed.case(`You have been warned from ${guild.name}`, reason)]
        })
        await interaction.reply({
            embeds: [Embed.default(`Case #${caseId}: warn`,`${user} has been warned.`, member.user)]
        })
    } catch (error) {
        await interaction.reply({ embeds: [Embed.warning('I couldn\'t DM this member, but their case was logged.')], ephemeral: true })
    }
})