import { MessageEmbed } from 'discord.js'
import { Event } from '../Structures/Event'
import { getGuildSettings } from '../Util/DB'

export default new Event('messageDelete', async (client, deletedMessage) => {
    let { user } = client
    
    if (!deletedMessage.inGuild())
        return
    
    let { guild, content, author, channel } = deletedMessage
    
    let settings = await getGuildSettings(guild.id)
    let activityLogs = guild.channels.cache.get(settings.channels.activity_logs)

    if (activityLogs?.type != 'GUILD_TEXT')
        return

    let webhook = await activityLogs.createWebhook(user.username, {
        avatar: user.displayAvatarURL({ format: 'png', size: 1024 })
    })

    let deletedContent = content.length > 1024 ? content.slice(0, 1021) + '...' : content

    await webhook.send({
        embeds: [
            new MessageEmbed({
                title: 'Message deleted!', color: 'BLURPLE',
                description: `${author.toString()} deleted their message in ${channel.toString()}`,
                fields: [
                    { name: 'Deleted content', value: deletedContent }
                ],
                timestamp: Date.now()
            })
        ]
    })
    await webhook.delete()
})