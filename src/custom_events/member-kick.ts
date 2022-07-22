import { ChannelType, EmbedBuilder } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import { sendWebhook } from '../Util/Common'
import { CustomEvent } from '../Util/CustomEventHandler'

export default new CustomEvent('kick', async (client, guild, moderator, user, reason) => {
    let settings = await GuildSettingsModel.get(guild.id)

    if (!settings.channels.moderationLogs)
        return

    let moderationLogs = guild.channels.cache.get(settings.channels.moderationLogs)

    if (moderationLogs?.type != ChannelType.GuildText)
        return

    await sendWebhook(client, moderationLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Member Kicked!').setColor('Blurple')
                .setDescription(`${user} was kicked.`)
                .addFields(
                    { name: 'Moderator', value: moderator.toString() },
                    { name: 'Reason', value: reason }
                )
                .setTimestamp()
        ]
    })
})