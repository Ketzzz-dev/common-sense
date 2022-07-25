import Command from '../../Structures/Command'
import { MODERATOR } from '../../Util/Common'
import { createWarnEmbed, createDefaultEmbed } from '../../Util/Embeds'
import CustomEventHandler from '../../Util/CustomEventHandler'
import { UserOption, StringOption } from '../../Structures/CommandOptions'

export default new Command({
    name: 'kick', category: 'moderation',
    description: 'Kicks `target` from the server.',
    permissions: MODERATOR,
    options: [
        new UserOption('target', 'The target user to kick.', true),
        new StringOption('reason', 'The reason this user was kicked.')
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    let target = options.getMember('target')
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({
            embeds: [createWarnEmbed('Unknown user.')],
            ephemeral: true
        })
    else if (target.id == user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot kick yourself, silly.')],
            ephemeral: true
        })
    else if (target.id == client.user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot kick me, silly.')],
            ephemeral: true
        })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot kick members with the same or higher permissions as you.')],      
            ephemeral: true
        })

    await target.send({
        embeds: [createDefaultEmbed(`You were kicked from ${guild.name}`, `Reason: ${reason}`, user)]
    })

    let kicked = await target.kick(reason)

    await interaction.reply({
        embeds: [
            createDefaultEmbed(`${kicked.user.tag} was kicked`, `Reason: ${reason}`, user)
        ]
    })

    CustomEventHandler.emit('kick', client.user, guild, user, target.user, reason)
})