import { ChannelType, EmbedBuilder } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import { sendWebhook } from '../Util/Common'
import { CustomEvent } from '../Util/CustomEventHandler'
import Logger from '../Util/Logger'

export default new CustomEvent('timeout', async (client, guild, moderator, user, time, reason) => {
    let settings = await GuildSettingsModel.get(guild.id)

    Logger.info('passed 1/4')

    if (!settings.channels.moderationLogs)
        return

    Logger.info('passed 2/4')

    let moderationLogs = guild.channels.cache.get(settings.channels.moderationLogs)

    if (moderationLogs?.type != ChannelType.GuildText)
        return

    Logger.info('passed 3/4')

    await sendWebhook(client, moderationLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Member Timed out!').setColor('Blurple')
                .setDescription(`${user} was timed out for ${time}.`)
                .addFields(
                    { name: 'Moderator', value: moderator.toString() },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp()
        ]
    })

    Logger.info('passed 4/4')
})