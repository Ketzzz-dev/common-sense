import { PermissionFlagsBits } from 'discord.js'
import GuildCasesModel, { CaseType } from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'untimeout', category: 'moderation',
    description: 'Unbans {user}.',
    memberPerms: PermissionFlagsBits.BanMembers,
    botPerms: PermissionFlagsBits.BanMembers,
    options: [
        new UserOption('user', 'The user to untimeout.', { required: true }),
        new StringOption('reason', 'The reason for this untimeout.')
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getMember('user')

    if (!user)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (user.id == member.id)
        return await interaction.reply({ embeds: [Embed.warning('You\'re not timed out, silly.')], ephemeral: true })
    else if (user.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('I\'m not timed out, silly.')], ephemeral: true })

    if (!user.isCommunicationDisabled())
        return await interaction.reply({ embeds: [Embed.warning('This user is not timed out.')], ephemeral: true })

    let reason = options.getString('reason') ?? 'No reason provided.'

    user.timeout(null, reason)

    let guildCases = await GuildCasesModel.get(guild.id)
    let caseId = await guildCases.addCase(CaseType.Untimeout, user.id, member.id, reason)

    await interaction.reply({ embeds: [Embed.default(`Case #${caseId}: untimeout`, `${user} has been untimed out.`, member.user)] })
})