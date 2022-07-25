import { Formatters } from 'discord.js'
import Command from '../../Structures/Command'
import { createDefaultEmbed } from '../../Util/Embeds'

export default new Command({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let { ws, readyAt } = client
    let { createdTimestamp, user } = interaction

    let sentMessage = await interaction.deferReply({ fetchReply: true })

    await interaction.editReply({
        embeds: [
            createDefaultEmbed(
                'Bot status', 'Here is an embed of the bot\'s current status.', user,
                {
                    name: 'Ping',
                    value: `API: \`${ws.ping} ms\`, Bot: \`${sentMessage.createdTimestamp - createdTimestamp} ms\``,
                    inline: true
                },
                { name: 'Uptime', value: Formatters.time(readyAt, 'R'), inline: true }
            )
        ]
    })
})