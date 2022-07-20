import { ApplicationCommandOptionType, EmbedBuilder, Formatters } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'user-info', category: 'information',
    description: 'Provides an embed of `user`\'s or your information.',
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: 'user', description: 'The user to display information of.'
        }
    ]
}, async (client, interaction) => {
    let { options, member, guild } = interaction

    let user = options.getMember('user') ?? member

    let roles = user.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(r => r.toString()).slice(0, -1)

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`**${user.user.tag}**'s information`).setColor('Green')
                .setThumbnail(user.displayAvatarURL({ extension: 'png', size: 1024 }))
                .setDescription([
                    `**Registered**: ${Formatters.time(user.user.createdAt, 'F')} ${Formatters.time(user.user.createdAt, 'R')}`,
                    `**Joined**: ${Formatters.time(user.joinedAt ?? guild.createdAt, 'F')} ${Formatters.time(user.joinedAt ?? guild.createdAt, 'R')}`,
                    '\u200B',
                    `**Status**: ${user.presence?.status ?? 'offline'}`
                ].join('\n'))
                .addFields(
                    {
                        name: 'Roles',
                        value: [
                            roles.length ? roles.join(', ') : 'None',
                            '\u200B',
                            `**Total**: ${roles.length}`
                        ].join('\n')
                    }
                )
                .setFooter({ text: `User: ${member.user.tag}` })
        ]
    })
})