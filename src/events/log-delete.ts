import { ChannelType, EmbedBuilder } from 'discord.js'
import { Event } from '../Structures/Event'
import { getGuildSettings } from '../Util/DB'

export default new Event('messageDelete', async (client, deletedMessage) => {
    let { user } = client
    
    if (!deletedMessage.inGuild())
        return
    
    let { guild, content, author, channel } = deletedMessage
    
    let settings = await getGuildSettings(guild.id)
    let activityLogs = guild.channels.cache.get(settings.channels.activity_logs)

    if (activityLogs?.type != ChannelType.GuildText)
        return

    let webhook = await activityLogs.createWebhook({
        name: user.username,
        avatar: user.displayAvatarURL({ extension: 'png', size: 1024 })
    })

    let deletedContent = content.length > 1024 ? content.slice(0, 1021) + '...' : content

    await webhook.send({
        embeds: [
            new EmbedBuilder()
                .setTitle('Message Deleted!').setColor('Blurple')
                .setDescription(`${author} deleted their message in ${channel}`)
                .addFields({ name: 'Deleted Content', value: deletedContent })
                .setTimestamp()
        ]
    })
    await webhook.delete()
})