import { bold, time } from '@discordjs/builders'
import { MessageEmbed } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let sentMessage = await interaction.deferReply({ fetchReply: true })
    let statusEmbed = new MessageEmbed({
        title: 'Bot status', color: 'GREEN',
        thumbnail: { url: client.user.displayAvatarURL({ size: 1024 }) },
        description: `Serving ${bold(client.users.cache.size.toString())} users in ${bold(client.guilds.cache.size.toString())} different servers!`,
        fields: [
            { name: 'Ping', value: `API: \`${client.ws.ping}ms\`, Bot: \`${sentMessage.createdTimestamp - interaction.createdTimestamp}ms\``, inline: true },
            { name: 'Uptime', value: time(client.readyAt, 'R'), inline: true }
        ]
    })

    await interaction.editReply({ embeds: [statusEmbed] })
})