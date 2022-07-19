import { Collection, Guild, GuildMember, Message } from 'discord.js'
import EventEmitter from 'eventemitter3'

export interface GuildEvents {
    'modTimeout': [guild: Guild, moderator: GuildMember, user: GuildMember, time: number, reason: string]
    'modKick': [guild: Guild, moderator: GuildMember, user: GuildMember, reason: string]
    'modBan': [guild: Guild, moderator: GuildMember, user: GuildMember, reason: string]
}

export default new EventEmitter<GuildEvents>()