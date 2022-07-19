import { AuditLogEvent, ChannelType, EmbedBuilder } from 'discord.js'
import { Event } from '../Structures/Event'
import { getGuildSettings } from '../Util/DB'
import { sendWebhook } from '../Util/Webhooks'

export default new Event('messageDelete', async (client, deletedMessage) => {
    let { user } = client
    
    if (!deletedMessage.inGuild())
        return
    
    let { guild, content, channel, author } = deletedMessage
    
    let settings = await getGuildSettings(guild.id)
    let activityLogs = guild.channels.cache.get(settings.channels.activity_logs)

    if (activityLogs?.type != ChannelType.GuildText)
        return

    let auditLogs = await guild.fetchAuditLogs({ limit: 7, type: AuditLogEvent.MessageDelete })
    let entry = auditLogs.entries.find(entry => entry.target.id == author.id && entry.extra.channel.id == channel.id)
    let perpetrator = entry?.executor ? entry.executor : author

    let deletedContent = content.length > 1024 ? content.slice(0, 1021) + '...' : content || 'None'

    await sendWebhook(user, activityLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Deleted!').setColor('Blurple')
                .setDescription(`${perpetrator} deleted a message in ${channel}`)
                .addFields({ name: 'Deleted Content', value: deletedContent })
                .setTimestamp()
        ]
    })
})