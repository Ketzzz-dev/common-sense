import { MessageEmbed } from 'discord.js'
import { Event } from '../Structures/Event'
import { getGuildSettings } from '../Util/DB'

export default new Event('messageUpdate', async (client, oldMessage, newMessage) => {
    let { user } = client

    if (!oldMessage.inGuild() || !newMessage.inGuild())
        return
    
    let settings = await getGuildSettings(oldMessage.guildId)
    let activityLogs = oldMessage.guild.channels.cache.get(settings.channels.activity_logs)

    if (activityLogs?.type != 'GUILD_TEXT')
        return

    let webhook = await activityLogs.createWebhook(user.username, {
        avatar: user.displayAvatarURL({ format: 'png', size: 1024 })
    })

    let oldContent = oldMessage.content.length > 1024 ? oldMessage.content.slice(0, 1021) + '...' : oldMessage.content
    let newContent = newMessage.content.length > 1024 ? newMessage.content.slice(0, 1021) + '...' : newMessage.content

    await webhook.send({
        embeds: [
            new MessageEmbed({
                title: 'Message edited!', color: 'BLURPLE',
                description: `${oldMessage.author.toString()} edited their message in ${oldMessage.channel.toString()}`,
                fields: [
                    { name: 'Old content', value: oldContent },
                    { name: 'New content', value: newContent }
                ],
                timestamp: Date.now()
            })
        ]
    })
    await webhook.delete()
})