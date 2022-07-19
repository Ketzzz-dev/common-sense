import { ChannelType, EmbedBuilder } from 'discord.js'
import { Event } from "../Structures/Event"
import GuildEvents from '../Util/GuildEvents'
import { getGuildSettings } from '../Util/DB'
import { sendWebhook } from '../Util/Webhooks'
import ms from 'ms'

export default new Event('ready', (client) => {
    GuildEvents
        .on('modTimeout', async (guild, moderator, user, time, reason) => {
            let settings = await getGuildSettings(guild.id)
            let moderationLogs = guild.channels.cache.get(settings.channels.moderation_logs)

            if (moderationLogs?.type != ChannelType.GuildText)
                return

            await sendWebhook(client.user, moderationLogs, {
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Member Timed Out!').setColor('Blurple')
                        .setDescription(`${moderator} timed ${user} out for **${ms(time, { long: true })}**`)
                        .addFields({ name: 'Reason', value: reason })
                        .setTimestamp()
                ]
            })  
        })
        .on('modBan', async (guild, moderator, user, reason) => {
            let settings = await getGuildSettings(guild.id)
            let moderationLogs = guild.channels.cache.get(settings.channels.moderation_logs)

            if (moderationLogs?.type != ChannelType.GuildText)
                return

            await sendWebhook(client.user, moderationLogs, {
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Member Banned!').setColor('Blurple')
                        .setDescription(`${moderator} banned ${user}`)
                        .addFields({ name: 'Reason', value: reason })
                        .setTimestamp()
                ]
            })  
        })
        .on('modKick', async (guild, moderator, user, reason) => {
            let settings = await getGuildSettings(guild.id)
            let moderationLogs = guild.channels.cache.get(settings.channels.moderation_logs)

            if (moderationLogs?.type != ChannelType.GuildText)
                return

            await sendWebhook(client.user, moderationLogs, {
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Member Kicked!').setColor('Blurple')
                        .setDescription(`${moderator} kicked ${user}`)
                        .addFields({ name: 'Reason', value: reason })
                        .setTimestamp()
                ]
            })  
        })
})