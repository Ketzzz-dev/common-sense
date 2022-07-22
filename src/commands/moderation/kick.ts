import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { Command } from '../../Structures/Command'
import { ADMINISTRATOR, MODERATOR } from '../../Util/Common'

export default new Command({
    name: 'kick', category: 'moderation',
    description: 'Kicks `target` from the server.',
    permissions: MODERATOR,
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'target', description: 'The target user to kick.',
            required: true
        },
        {
            type: ApplicationCommandOptionType.String,
            name: 'reason', description: 'The reason this user was kicked.'
        }
    ]
}, async (client, interaction) => {
    let { options, guild, user, member } = interaction

    let target = options.getMember('target')
    let reason = options.getString('reason') ?? 'No reason provided.'

    if (!target)
        return await interaction.reply({ content: 'Unknown user.', ephemeral: true })
    else if (target.id == user.id)
        return await interaction.reply({ content: 'You cannot kick yourself, silly.', ephemeral: true })
    else if (target.id == client.user.id)
        return await interaction.reply({ content: 'You cannot kick me, silly.', ephemeral: true })
    else if (target.permissions.has(MODERATOR))
        return await interaction.reply({ content: 'You cannot kick members with the same or higher permissions as you.', ephemeral: true })

    let staffLevel = member.permissions.has(ADMINISTRATOR) ? 'Administrator' : 'Moderator'

    await target.send({
        embeds: [
            new EmbedBuilder()
                .setTitle(`You were kicked from **${guild.name}**!`).setColor('DarkButNotBlack')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `${staffLevel}: ${user.tag}` })
        ]
    })
    await target.kick(reason)
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`**${target.user.tag}** was kicked!`).setColor('Blue')
                .setDescription(`**Reason**: ${reason}`)
                .setFooter({ text: `${staffLevel}: ${user.tag}` })
        ]
    })
})