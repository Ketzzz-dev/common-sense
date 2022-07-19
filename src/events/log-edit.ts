import { ChannelType, EmbedBuilder } from 'discord.js'
import { Event } from '../Structures/Event'
import { getGuildSettings } from '../Util/DB'

export default new Event('messageUpdate', async (client, oldMessage, newMessage) => {
    let { user } = client

    if (!oldMessage.inGuild() || !newMessage.inGuild())
        return
    
    let settings = await getGuildSettings(oldMessage.guildId)
    let activityLogs = oldMessage.guild.channels.cache.get(settings.channels.activity_logs)

    if (activityLogs?.type != ChannelType.GuildText)
        return

    let webhook = await activityLogs.createWebhook({
        name: user.username,
        avatar: user.displayAvatarURL({ extension: 'png', size: 1024 })
    })

    let oldContent = oldMessage.content.length > 1024 ? oldMessage.content.slice(0, 1021) + '...' : oldMessage.content
    let newContent = newMessage.content.length > 1024 ? newMessage.content.slice(0, 1021) + '...' : newMessage.content

    await webhook.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Edited!').setColor('Blurple')
                .setDescription(`${oldMessage.author} edited their message in ${oldMessage.channel}`)
                .addFields(
                    { name: 'Old Content', value: oldContent },
                    { name: 'New Content', value: newContent }
                )
                .setTimestamp()
        ]
    })
    await webhook.delete()
})