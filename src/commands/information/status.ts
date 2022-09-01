import { time } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import Embed from '../../Util/Embeds'

export default new SlashCommand({
    name: 'status', category: 'information',
    description: 'Provides an embed of the bot\'s current status.',
}, async (client, interaction) => {
    let { ws, readyAt } = client
    let { createdTimestamp } = interaction

    let sentMessage = await interaction.deferReply({ fetchReply: true })

    await interaction.editReply({
        embeds: [
            Embed.info(
                'Here is an embed of the bot\'s current status.',
                {
                    name: 'Ping',
                    value: `API: \`${ws.ping} ms\`, Bot: \`${sentMessage.createdTimestamp - createdTimestamp} ms\``,
                    inline: true
                },
                { name: 'Uptime', value: time(readyAt, 'R'), inline: true }
            )
        ]
    })
})