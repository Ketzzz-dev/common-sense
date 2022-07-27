// import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType, Severity } from '@typegoose/typegoose'
// import { HydratedDocument } from 'mongoose'

// export class GuildChannelSettings {
//     @prop({ unique: true })
//     public activityLogs?: string
//     @prop({ unique: true })
//     public moderationLogs?: string

//     @prop({ unique: true })
//     public botSpam?: string
// }
// export class GuildRoleSettings {
//     @prop({ unique: true })
//     public moderator?: string
//     @prop({ unique: true })
//     public administrator?: string
// }

// @modelOptions({ options: { allowMixed: Severity.ALLOW } })
// export class GuildSettings {
//     @prop({ required: true, unique: true })
//     public guildId!: string

//     @prop({ default: () => ({}), _id: false })
//     public channels!: GuildChannelSettings
//     @prop({ default: () => ({}), _id: false })
//     public roles!: GuildRoleSettings

//     @prop({ default: () => 3 })
//     public cooldown!: number

//     public static async getGuild(this: ReturnModelType<typeof GuildSettings>, guildId: string): Promise<HydratedDocument<GuildSettings>> {
//         let settingsDocument = await this.findOne({ guildId }).exec()

//         if (!settingsDocument) {
//             settingsDocument = await this.create({ guildId })

//             await settingsDocument.save()
//         }

//         return settingsDocument
//     }

//     public async setChannel(this: DocumentType<GuildSettings>, functionality: keyof GuildChannelSettings, channelId: string): Promise<void> {
//         this.channels[functionality] = channelId

//         await this.save()
//     }
//     public async setRole(this: DocumentType<GuildSettings>, functionality: keyof GuildRoleSettings, roleId: string): Promise<void> {
//         this.roles[functionality] = roleId

//         await this.save()
//     }
//     public async setCooldown(this: DocumentType<GuildSettings>, cooldown: number): Promise<void> {
//         this.cooldown = cooldown

//         await this.save()
//     }
// }

// export default getModelForClass(GuildSettings)