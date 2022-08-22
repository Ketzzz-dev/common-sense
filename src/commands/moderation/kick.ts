import { PermissionFlagsBits } from 'discord.js'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'kick', category: 'moderation',
    description: 'Kicks {user}.',
    memberPerms: [PermissionFlagsBits.KickMembers],
    botPerms: [PermissionFlagsBits.KickMembers],
    options: [
        new UserOption('user', 'The user to kick.', { required: true }),
        new StringOption('reason', 'The reason for this kick.') 
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getMember('user')

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick yourself, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick me, silly.')], ephemeral: true })
    else if (user.permissions.has(MODERATOR) && !member.permissions.has(PermissionFlagsBits.Administrator))
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick members with the same or higher permissions as you.')], ephemeral: true })
    else if (!user.kickable)
        return await interaction.reply({ embeds: [Embed.warning('I can\'t kick this user.')] })

    let reason = options.getString('reason') ?? 'No reason provided.'
    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Kick, user.id, member.id, reason)
    
    try {
        await user.send({
            embeds: [Embed.case(`You have been kicked from ${guild.name}`, reason)]
        })
        await interaction.reply({
            embeds: [Embed.default(`Case #${caseId}: kick`, `${user} has been kicked.`, member.user)]
        })
    } catch (error) {
        await interaction.reply({ embeds: [Embed.warning('I could\'nt DM this member, but their case was logged.')], ephemeral: true })
    } finally {
        await user.kick(reason)
    }


})