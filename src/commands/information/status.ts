import { EmbedBuilder, Formatters } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let { users, guilds, ws, readyAt } = client
    let { createdTimestamp, user } = interaction

    let sentMessage = await interaction.deferReply({ fetchReply: true })

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Bot Status').setColor('Green')
                .setThumbnail(client.user.displayAvatarURL({ extension: 'png', size: 1024 }))
                .setDescription(`Serving **${users.cache.size.toLocaleString()}** users in **${guilds.cache.size.toLocaleString()}** different servers!`)
                .addFields(
                    {
                        name: 'Ping',
                        value: `**API**: \`${ws.ping} ms\`, **Bot**: \`${sentMessage.createdTimestamp - createdTimestamp} ms\``,
                        inline: true
                    },
                    { name: 'Uptime', value: Formatters.time(readyAt, 'R'), inline: true }
                )
                .setFooter({ text: `User: ${user.tag}`})
        ]
    })
})