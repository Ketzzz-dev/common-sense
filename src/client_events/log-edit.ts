// import { ChannelType } from 'discord.js'
// import ClientEvent from '../Structures/ClientEvent'
// import { sendWebhook } from '../Util/Common'
// import GuildSettingsModel from '../Models/GuildSettingsModel'
// import { createLogEmbed } from '../Util/Embeds'

// export default new ClientEvent('messageUpdate', async (client, oldMessage, newMessage) => {
//     let { user } = client

//     if (!oldMessage.inGuild() || !newMessage.inGuild() || !newMessage.content)
//         return
    
//     let settings = await GuildSettingsModel.get(oldMessage.guild.id)

//     if (!settings.channels.activityLogs)
//         return

//     let activityLogs = oldMessage.guild.channels.cache.get(settings.channels.activityLogs)

//     if (activityLogs?.type != ChannelType.GuildText)
//         return
    
//     let oldContent = oldMessage.content.length > 1024 ? oldMessage.content.slice(0, 1021) + '...' : oldMessage.content || 'None'
//     let oldAttachments = oldMessage.attachments.size ? oldMessage.attachments.map(att => att.proxyURL).join('\n') : 'None'
//     let newContent = newMessage.content.length > 1024 ? newMessage.content.slice(0, 1021) + '...' : newMessage.content
//     let newAttachments = newMessage.attachments.size ? newMessage.attachments.map(att => att.proxyURL).join('\n') : 'None'


//     await sendWebhook(user, activityLogs, {
//         embeds: [
//             createLogEmbed(
//                 'Message edited', `${oldMessage.author} edited their message in ${oldMessage.channel}`,
//                 { name: 'Old content', value: oldContent },
//                 { name: 'Old attachments', value: oldAttachments },
//                 { name: 'New content', value: newContent },
//                 { name: 'New attachments', value: newAttachments }
//             )
//         ]
//     })
// })