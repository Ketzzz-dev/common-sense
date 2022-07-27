import { PermissionFlagsBits } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import { StringOption, UserOption } from '../../Structures/SlashCommandOptions'
import { MODERATOR } from '../../Util/Common'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'warn', category: 'moderation',
    description: 'Warns {target}.',
    memberPerms: [PermissionFlagsBits.ModerateMembers],
    options: [
        new UserOption('target', 'The user to warn.', { required: true }),
        new StringOption('reason', 'The reason for this warn.') 
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let target = options.getMember('target')

    if (!target)
        return await interaction.reply({ embeds: [Embed.warning('Unknown user.')], ephemeral: true })
    else if (target.id == member.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn yourself, silly.')] })
    else if (target.id == client.user.id)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn me, silly.')] })
    else if (target.permissions.has(MODERATOR) && target.roles.highest.position >= member.roles.highest.position)
        return await interaction.reply({ embeds: [Embed.warning('You can\'t warn members with the same or higher permissions as you.')] })

    let reason = options.getString('reason') ?? 'No reason provided.'
    
    await target.send({
        embeds: [Embed.case(`You have been warned from ${guild.name}`, reason)]
    })

    await interaction.reply({
        embeds: [Embed.case(`${target} has been kicked.`, reason)]
    })
})