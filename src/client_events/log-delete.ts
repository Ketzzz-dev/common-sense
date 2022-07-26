// import { AuditLogEvent, ChannelType, EmbedBuilder } from 'discord.js'
// import ClientEvent from '../Structures/ClientEvent'
// import { sendWebhook } from '../Util/Common'
// import GuildSettingsModel from '../Models/GuildSettingsModel'
// import { createLogEmbed } from '../Util/Embeds'

// export default new ClientEvent('messageDelete', async (client, deletedMessage) => {
//     let { user } = client
    
//     if (!deletedMessage.inGuild())
//         return
    
//     let { guild, content, attachments, channel, author } = deletedMessage
    
//     let settings = await GuildSettingsModel.get(guild.id)

//     if (!settings.channels.activityLogs)
//         return

//     let activityLogs = guild.channels.cache.get(settings.channels.activityLogs)

//     if (activityLogs?.type != ChannelType.GuildText)
//         return

//     let auditLogs = await guild.fetchAuditLogs({ limit: 7, type: AuditLogEvent.MessageDelete })
//     let entry = auditLogs.entries.find(entry => entry.target.id == author.id && entry.extra.channel.id == channel.id)
//     let perpetrator = entry?.executor ? entry.executor : author

//     let deletedContent = content.length > 1024 ? content.slice(0, 1021) + '...' : content || 'None'
//     let deletedAttachments = attachments.size ? attachments.map(att => att.proxyURL).join('\n') : 'None'

//     await sendWebhook(user, activityLogs, {
//         embeds: [
//             createLogEmbed(
//                 'Message deleted', `${perpetrator} deleted a message in ${channel}`,
//                 { name: 'Deleted content', value: deletedContent },
//                 { name: 'Deleted attachments', value: deletedAttachments }
//             )
//         ]
//     })
// })