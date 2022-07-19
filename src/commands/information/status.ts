import { EmbedBuilder, time } from 'discord.js'
import { Command } from '../../Structures/Command'

export default new Command({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let { users, guilds, ws, readyAt } = client

    let sentMessage = await interaction.deferReply({ fetchReply: true })

    await interaction.editReply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Bot Status').setColor('Green')
                .setDescription(`Serving **${users.cache.size.toLocaleString()}** users in **${guilds.cache.size.toLocaleString()}** different servers!`)
                .addFields(
                    {
                        name: 'Ping',
                        value: `**API**: \`${ws.ping} ms\`, **Bot**: \`${sentMessage.createdTimestamp - interaction.createdTimestamp} ms\``,
                        inline: true
                    },
                    { name: 'Uptime', value: time(readyAt, 'R'), inline: true }
                )
                .setFooter({ text: `User: ${interaction.user.tag}`})
        ]
    })
})