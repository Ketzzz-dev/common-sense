import { APIEmbedField, Colors, EmbedBuilder, User } from 'discord.js'

export function createDefaultEmbed(title: string, description: string, author: User, ...fields: APIEmbedField[]): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title).setColor(Colors.Fuchsia)
        .setDescription(description)
        .addFields(...fields)
        .setFooter({
            iconURL: author.displayAvatarURL({ extension: 'png', size: 512 }),
            text: author.tag
        })
        .setTimestamp()
}
export function createWarnEmbed(message: string): EmbedBuilder {
    return new EmbedBuilder()
        .setColor(Colors.Yellow)
        .setDescription(message)
}
export function createLogEmbed(title: string, description: string, ...fields: APIEmbedField[]): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle(title).setColor(Colors.Blue)
        .setDescription(description)
        .addFields(...fields)
        .setTimestamp()
}