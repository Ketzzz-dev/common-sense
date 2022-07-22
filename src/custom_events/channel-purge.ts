import { ChannelType, EmbedBuilder } from 'discord.js'
import GuildSettingsModel from '../Models/GuildSettingsModel'
import { sendWebhook } from '../Util/Common'
import { CustomEvent } from '../Util/CustomEventHandler'

export default new CustomEvent('purge', async (client, guild, moderator, channel, messages) => {
    let settings = await GuildSettingsModel.get(guild.id)

    if (!settings.channels.moderationLogs)
        return

    let moderationLogs = guild.channels.cache.get(settings.channels.moderationLogs)

    if (moderationLogs?.type != ChannelType.GuildText)
        return

    await sendWebhook(client, moderationLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Messages Purged!').setColor('Blurple')
                .setDescription(`**${messages.size}** messages were purged from ${channel}.`)
                .addFields(
                    { name: 'Moderator', value: moderator.toString() }
                )
                .setTimestamp()
        ]
    })
})