import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType, Severity } from '@typegoose/typegoose'

export class Logging {
    @prop()
    public activity?: string
    @prop()
    public moderation?: string
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GuildSettings {
    @prop({ required: true, unique: true })
    public guildId!: string

    @prop({ default: () => ({}), _id: false })
    public logging!: Logging

    public static async get(this: ReturnModelType<typeof GuildSettings>, guildId: string): Promise<DocumentType<GuildSettings>> {
        let doc = await this.findOne({ guildId }).exec()

        if (!doc) {
            doc = await this.create({ guildId })

            await doc.save()
        }

        return doc
    }

    public async setLogging(this: DocumentType<GuildSettings>, type: keyof Logging, channelId: string): Promise<void> {
        this.logging[type] = channelId

        await this.save()
    }
}

export default getModelForClass(GuildSettings)