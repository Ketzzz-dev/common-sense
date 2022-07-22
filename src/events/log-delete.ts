import { AuditLogEvent, ChannelType, EmbedBuilder } from 'discord.js'
import { Event } from '../Structures/Event'
import { sendWebhook } from '../Util/Common'
import GuildSettingsModel from '../Models/GuildSettingsModel'

export default new Event('messageDelete', async (client, deletedMessage) => {
    let { user } = client
    
    if (!deletedMessage.inGuild())
        return
    
    let { guild, content, attachments, channel, author } = deletedMessage
    
    let settings = await GuildSettingsModel.get(guild.id)

    if (!settings.channels.activityLogs)
        return

    let activityLogs = guild.channels.cache.get(settings.channels.activityLogs)

    if (activityLogs?.type != ChannelType.GuildText)
        return

    let auditLogs = await guild.fetchAuditLogs({ limit: 7, type: AuditLogEvent.MessageDelete })
    let entry = auditLogs.entries.find(entry => entry.target.id == author.id && entry.extra.channel.id == channel.id)
    let perpetrator = entry?.executor ? entry.executor : author

    let deletedContent = content.length > 1024 ? content.slice(0, 1021) + '...' : content || 'None'
    let deletedAttachments = attachments.size ? attachments.map(att => att.proxyURL).join('\n') : 'None'


    await sendWebhook(user, activityLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Deleted!').setColor('Blurple')
                .setDescription(`${perpetrator} deleted a message in ${channel}`)
                .addFields(
                    { name: 'Deleted Content', value: deletedContent },
                    { name: 'Deleted Attachments', value: deletedAttachments }
                )
                .setTimestamp()
        ]
    })
})