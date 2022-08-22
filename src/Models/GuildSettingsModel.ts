import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType, Severity } from '@typegoose/typegoose'

const CACHE = new Map<string, DocumentType<GuildSettings>>()

export class Logging {
    @prop({ default: () => ({}), _id: false })
    public activity!: LogChannel
    @prop({ default: () => ({}), _id: false })
    public case!: LogChannel
}
export class LogChannel {
    @prop({ unique: true })
    public channelId?: string
    @prop({ type: String, default: () => [] })
    public ignored!: string []
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GuildSettings {
    @prop({ required: true, unique: true })
    public guildId!: string

    @prop({ default: () => ({}), _id: false })
    public logging!: Logging

    public static async get(this: ReturnModelType<typeof GuildSettings>, guildId: string): Promise<DocumentType<GuildSettings>> {
        let doc: DocumentType<GuildSettings> | undefined | null
        
        doc = CACHE.get(guildId)

        if (doc)
            return doc

        doc = await this.findOne({ guildId }).exec()

        if (!doc) {
            doc = await this.create({ guildId })

            await doc.save()
        }

        CACHE.set(guildId, doc)

        return doc
    }

    public async setLogging(this: DocumentType<GuildSettings>, type: keyof Logging, channelId?: string): Promise<void> {
        channelId ? this.logging[type].channelId = channelId : delete this.logging[type]

        await this.save()
    }
}

export default getModelForClass(GuildSettings)