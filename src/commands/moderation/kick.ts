import { PermissionFlagsBits } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'kick', category: 'moderation',
    description: 'Kicks {target}.',
    memberPerms: [PermissionFlagsBits.KickMembers],
    botPerms: [PermissionFlagsBits.KickMembers],
    options: [
        new UserOption('target', 'The user to kick.', { required: true }),
        new StringOption('reason', 'The reason for this kick.') 
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let target = options.getMember('target')

    if (!target)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (target.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick yourself, silly.')] })
    else if (target.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick me, silly.')] })
    else if (target.permissions.has(MODERATOR) && target.roles.highest.position >= member.roles.highest.position)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t kick members with the same or higher permissions as you.')] })

    let reason = options.getString('reason') ?? 'No reason provided.'
    
    await target.send({
        embeds: [Embed.case(`You have been kicked from ${guild.name}`, reason)]
    })

    let kicked = await target.kick(reason)

    await interaction.reply({
        embeds: [Embed.default(`Case #${null}: kick`, `${kicked} has been kicked.`, member.user)]
    })
})