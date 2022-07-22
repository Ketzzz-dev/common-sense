import { ChannelType, EmbedBuilder } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import { sendWebhook } from '../Util/Common'
import { CustomEvent } from '../Util/CustomEventHandler'

export default new CustomEvent('ban', async (client, guild, moderator, user, time, reason) => {
    let settings = await GuildSettingsModel.get(guild.id)

    if (!settings.channels.moderationLogs)
        return

    let moderationLogs = guild.channels.cache.get(settings.channels.moderationLogs)

    if (moderationLogs?.type != ChannelType.GuildText)
        return

    await sendWebhook(client, moderationLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Member Banned!').setColor('Blurple')
                .setDescription(`${user} was banned ${time}.`)
                .addFields(
                    { name: 'Moderator', value: moderator.toString() },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp()
        ]
    })
})