import { ClientUser, MessagePayload, PermissionFlagsBits, PermissionsBitField, TextChannel, WebhookMessageOptions } from 'discord.js'
/**
 * A simple method to easily import files that have a default export.
 * 
 * @param path - The path to the file.
 */
export const MODERATOR = PermissionsBitField.resolve([
    PermissionFlagsBits.BanMembers, PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.UseApplicationCommands
])
export const ADMINISTRATOR = PermissionsBitField.resolve(PermissionFlagsBits.Administrator)

export const MAX_32_BIT_SIGNED = 2_147_483_647

export async function defaultImport<T>(path: string): Promise<T> {
    return (await import(path))?.default

}
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
export function setLongTimeout<T extends any[]>(callback: (...args: T) => void, timeout: number, ...args: T): NodeJS.Timer {
    let iterations = 0
    let maxIterations = timeout / MAX_32_BIT_SIGNED
    let timer: NodeJS.Timer

    return timer = setInterval(function onInterval() {
        iterations++

        if (iterations > maxIterations) {
            clearInterval(timer)
            callback(...args)
        }
    })
}