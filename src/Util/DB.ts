import { HydratedDocument } from 'mongoose'
import GuildSettings, { IGuildSettings } from '../models/GuildSettings'

export async function getGuildSettings(id: string): Promise<HydratedDocument<IGuildSettings>> {
    let data = await GuildSettings.findOne({ guild_id: id })

    if (!data) {
        data = new GuildSettings({ guild_id: id })

        await data.save()
    }

    return data
}
