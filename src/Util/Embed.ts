import { APIEmbed, APIEmbedField, Colors, Formatters, User } from 'discord.js'

export default class Embed {
    private constructor () {}

    public static default(title: string, description: string, author: User, ...fields: APIEmbedField[]): APIEmbed {
        return {
            color: Colors.Fuchsia,
            title, description, fields,
            footer: {
                icon_url: author.displayAvatarURL({ extension: 'png', size: 512 }),
                text: author.tag
            },
            timestamp: new Date().toISOString()
        }
    }
    public static warning(message: string): APIEmbed {
        return {
            color: Colors.Orange,
            description: message
        }
    }
    public static case(message: string, reason: string): APIEmbed {
        return {
            color: Colors.DarkButNotBlack,
            title: message, description: `Reason: ${reason}`,
            timestamp: new Date().toISOString()
        }
    }
    public static error(commandName: string, error: any): APIEmbed {
        return {
            color: Colors.Red,
            title: `Error while executing ${commandName}`,
            description: Formatters.codeBlock(`${error}`),
            timestamp: new Date().toISOString()
        }
    }
}