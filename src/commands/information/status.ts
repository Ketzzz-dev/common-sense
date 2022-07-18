import { bold, time } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let { user: clientUser, users, guilds, ws, readyAt } = client
    let { createdTimestamp: timestampB, user: interactionUser } = interaction

    let { createdTimestamp: timestampA } = await interaction.deferReply({ fetchReply: true })

    await interaction.editReply({ 
        embeds: [
            new MessageEmbed({
                title: 'Bot status', color: 'GREEN',
                thumbnail: { url: clientUser.displayAvatarURL({ size: 1024 }) },
                description: `Serving ${bold(users.cache.size.toString())} users in ${bold(guilds.cache.size.toString())} different servers!`,
                fields: [
                    { name: 'Ping', value: `API: \`${ws.ping}ms\`, Bot: \`${timestampA - timestampB}ms\``, inline: true },
                    { name: 'Uptime', value: time(readyAt, 'R'), inline: true }
                ],
                footer: { text: `User: ${interactionUser.tag}` }
            })
        ]
    })
})