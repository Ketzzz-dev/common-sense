import { ChannelType, EmbedBuilder } from 'discord.js'
import ClientEvent from '../Structures/ClientEvent'
import { sendWebhook } from '../Util/Common'
import GuildSettingsModel from '../Models/GuildSettingsModel'

export default new ClientEvent('messageUpdate', async (client, oldMessage, newMessage) => {
    let { user } = client

    if (!oldMessage.inGuild() || !newMessage.inGuild() || !newMessage.content)
        return
    
    let settings = await GuildSettingsModel.get(oldMessage.guild.id)

    if (!settings.channels.activityLogs)
        return

    let activityLogs = oldMessage.guild.channels.cache.get(settings.channels.activityLogs)

    if (activityLogs?.type != ChannelType.GuildText)
        return
    
    let oldContent = oldMessage.content.length > 1024 ? oldMessage.content.slice(0, 1021) + '...' : oldMessage.content || 'None'
    let oldAttachments = oldMessage.attachments.size ? oldMessage.attachments.map(att => att.proxyURL).join('\n') : 'None'
    let newContent = newMessage.content.length > 1024 ? newMessage.content.slice(0, 1021) + '...' : newMessage.content
    let newAttachments = newMessage.attachments.size ? newMessage.attachments.map(att => att.proxyURL).join('\n') : 'None'


    await sendWebhook(user, activityLogs, {
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Edited!').setColor('Blurple')
                .setDescription(`${oldMessage.author} edited their message in ${oldMessage.channel}`)
                .addFields(
                    { name: 'Old Content', value: oldContent },
                    { name: 'Old Attachments', value: oldAttachments },
                    { name: 'New Content', value: newContent },
                    { name: 'New Attachments', value: newAttachments }
                )
                .setTimestamp()
        ]
    })
})