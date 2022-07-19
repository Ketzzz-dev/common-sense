import { model, Schema } from 'mongoose'

export interface IChannelSettings {
    activity_logs: string
    moderation_logs: string
    bot_spam: string
}
export interface IRoleSettings {
    moderator: string
    administrator: string
}
export interface IGuildSettings {
    guild_id: string

    channels: IChannelSettings
    roles: IRoleSettings
}

const CHANNEL_SETTINGS = new Schema<IChannelSettings>({
    activity_logs: { type: String, unique: true },
    moderation_logs: { type: String, unique: true },
    bot_spam: { type: String, unique: true }
})
const ROLE_SETTINGS = new Schema<IRoleSettings>({
    moderator: { type: String, unique: true },
    administrator: { type: String, unique: true }
})
const GUILD_SETTINGS = new Schema<IGuildSettings>({
    guild_id: { type: String, required: true, unique: true },

    channels: { type: CHANNEL_SETTINGS, default: () => ({}) },
    roles: { type: ROLE_SETTINGS, default: () => ({}) }
})

export default model('GuildSettings', GUILD_SETTINGS)