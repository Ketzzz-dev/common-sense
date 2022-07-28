import { DocumentType, getModelForClass, modelOptions, prop, ReturnModelType, Severity } from '@typegoose/typegoose'    

export enum CaseType {
    Warn = 'warn',
    Timeout = 'timeout',
    Kick = 'kick',
    Ban = 'ban'
}

export class Case {
    @prop({ required: true })
    public id!: number

    @prop({ required: true, enum: CaseType })
    public type!: CaseType

    @prop({ required: true })
    public userId!: string

    @prop({ required: true })
    public moderatorId!: string

    @prop({ required: true })
    public reason!: string

    @prop({ required: true })
    public timestamp!: Date
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class GuildCases {
    @prop({ required: true, unique: true })
    public guildId!: string

    @prop({ default: () => 0 })
    public size!: number

    @prop({ type: Case, default: () => [], _id: false })    
    public cases!: Case[]

    public static async get(this: ReturnModelType<typeof GuildCases>, guildId: string): Promise<DocumentType<GuildCases>> {
        let doc = await this.findOne({ guildId }).exec()

        if (!doc) {
            doc = await this.create({ guildId })

            await doc.save()
        }

        return doc
    }

    public async addCase(this: DocumentType<GuildCases>, type: CaseType, userId: string, moderatorId: string, reason: string): Promise<number> {
        this.cases.push({
            id: ++this.size,
            type, userId, moderatorId, reason,
            timestamp: new Date()
        })

        return (await this.save()).size
    }
    public getUserCases(this: DocumentType<GuildCases>, userId: string): Case[] {
        return this.cases.filter(c => c.userId == userId)
    }
    public getModeratorCases(this: DocumentType<GuildCases>, moderatorId: string): Case[] {
        return this.cases.filter(c => c.moderatorId == moderatorId)
    }
}

export default getModelForClass(GuildCases)