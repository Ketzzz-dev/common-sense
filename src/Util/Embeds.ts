import { APIEmbed, APIEmbedField, Colors, User } from 'discord.js'

export default class extends null {
    private constructor () {}

    public static info(message: string, ...fields: APIEmbedField[]): APIEmbed {
        return {
            color: Colors.Fuchsia,
            description: message, fields,
            timestamp: new Date().toISOString()
        }
    }
    public static warning(message: string, ...fields: APIEmbedField[]): APIEmbed {
        return {
            color: Colors.Orange,
            description: message, fields,
            timestamp: new Date().toISOString()
        }
    }
    public static error(message: string, error?: Error | any): APIEmbed {
        return {
            color: Colors.Orange,
            description: message,
            timestamp: new Date().toISOString()
        }
    }
}