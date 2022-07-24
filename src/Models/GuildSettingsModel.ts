import { getModelForClass, modelOptions, prop, PropType, ReturnModelType, Severity } from '@typegoose/typegoose'
import { HydratedDocument } from 'mongoose'

export class GuildChannelSettings {
    @prop({ unique: true })
    public activityLogs?: string
    @prop({ unique: true })
    public moderationLogs?: string

    @prop({ unique: true })
    public botSpam?: string
}
export class GuildRoleSettings {
    @prop({ unique: true })
    public moderator?: string
    @prop({ unique: true })
    public administrator?: string
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GuildSettings {
    @prop({ required: true, unique: true })
    public guildId!: string

    @prop({ default: () => ({}), _id: false })
    public channels!: GuildChannelSettings
    @prop({ default: () => ({}), _id: false })
    public roles!: GuildRoleSettings

    @prop({ type: Boolean, default: () => ({}) })
    public commands!: Map<string, boolean>

    public static async initialise(this: ReturnModelType<typeof GuildSettings>, guildId: string): Promise<void> {
        let settingsDocument = await this.create({ guildId })

        await settingsDocument.save()
    }
    public static async get(this: ReturnModelType<typeof GuildSettings>, guildId: string): Promise<HydratedDocument<GuildSettings>> {
        let settingsDocument = await this.findOne({ guildId }).exec()

        if (!settingsDocument) {
            settingsDocument = await this.create({ guildId })

            await settingsDocument.save()
        }

        return settingsDocument
    }

    public static async setChannelFunctionality(this: ReturnModelType<typeof GuildSettings>, guildId: string, functionality: keyof GuildChannelSettings, channelId: string): Promise<void> {
        let settingsDocument = await this.findOne({ guildId }).exec()

        if (!settingsDocument)
            return
        
        settingsDocument.channels[functionality] = channelId

        await settingsDocument.save()
    }
    public static async setRoleFunctionality(this: ReturnModelType<typeof GuildSettings>, guildId: string, functionality: keyof GuildRoleSettings, roleId: string): Promise<void> {
        let settingsDocument = await this.findOne({ guildId }).exec()

        if (!settingsDocument)
            return
        
        settingsDocument.roles[functionality] = roleId

        await settingsDocument.save()
    }
    public static async setCommandEnabled(this: ReturnModelType<typeof GuildSettings>, guildId: string, commandName: string, enabled: boolean): Promise<void> {
        let settingsDocument = await this.findOne({ guildId }).exec()

        if (!settingsDocument)
            return

        settingsDocument.commands.set(commandName, enabled)

        await settingsDocument.save()
    }
}

export default getModelForClass(GuildSettings)