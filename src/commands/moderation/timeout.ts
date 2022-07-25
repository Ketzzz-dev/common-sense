import Command from '../../Structures/Command'
import { MODERATOR } from '../../Util/Common'
import { Formatters } from 'discord.js'
import ms from 'ms'
import { createWarnEmbed, createDefaultEmbed } from '../../Util/Embeds'
import CustomEventHandler from '../../Util/CustomEventHandler'
import { UserOption, StringOption } from '../../Structures/CommandOptions'

export default new Command({
    name: 'timeout', category: 'moderation',
    description: 'Times `target` out for `time`.',
    permissions: MODERATOR,
    options: [
        new UserOption('target', 'The target user to timeout.', true),
        new StringOption('time', 'The length of the timeout.', true),
        new StringOption('reason', 'The reason this user was timed out.')
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    let target = options.getMember('target')
    let time = options.getString('time', true)
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({
            embeds: [createWarnEmbed('Unknown user.')],
            ephemeral: true
        })
    else if (target.id == user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot time yourself out, silly.')],
            ephemeral: true
        })
    else if (target.id == client.user.id)
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot time me out, silly.')],
            ephemeral: true
        })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({
            embeds: [createWarnEmbed('You cannot time members out with the same or higher permissions as you.')],      
            ephemeral: true
        })
    
    let timeoutLength
    
    try {
        timeoutLength = ms(time)
    } catch (error) {
        return await interaction.reply({ embeds: [createWarnEmbed('Option `time` is invalid.')], ephemeral: true })
    }

    let longTimeout = ms(timeoutLength, { long: true })

    await target.send({
        embeds: [createDefaultEmbed(`You were timed out from ${guild.name} for ${longTimeout}`, Formatters.codeBlock(reason), user)]
    })

    let timedOut = await target.timeout(timeoutLength, reason)

    await interaction.reply({
        embeds: [createDefaultEmbed(`${timedOut.user.tag} was timed out for ${longTimeout}!`, Formatters.codeBlock(reason), user)]
    })

    CustomEventHandler.emit('timeout', client.user, guild, user, target.user, longTimeout, reason)
})