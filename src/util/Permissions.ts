import { PermissionFlagsBits } from 'discord-api-types/v10'
import { Permissions } from 'discord.js'

export const MODERATOR = Permissions.resolve([
    PermissionFlagsBits.BanMembers, PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.ViewAuditLog
])
export const ADMINISTRATOR = Permissions.resolve(PermissionFlagsBits.Administrator)