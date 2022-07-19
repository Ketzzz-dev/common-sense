import { ClientUser, MessagePayload, TextChannel, WebhookMessageOptions } from 'discord.js'

export async function sendWebhook(client: ClientUser, channel: TextChannel, payload: MessagePayload | Omit<WebhookMessageOptions, 'flags'>): Promise<void> {
    let webhook = await channel.createWebhook({
        name: client.username,
        avatar: client.displayAvatarURL({ extension: 'png', size: 1024 })
    })

    try {
        await webhook.send(payload)
        await webhook.delete()
    } catch (error) {
        console.error(error)
    }
}