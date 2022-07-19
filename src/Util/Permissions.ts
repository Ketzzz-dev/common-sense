import { PermissionFlagsBits, PermissionsBitField } from 'discord.js'

export const MODERATOR = PermissionsBitField.resolve([
    PermissionFlagsBits.BanMembers, PermissionFlagsBits.ChangeNickname,
    PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker,
    PermissionFlagsBits.ViewAuditLog
])
export const ADMINISTRATOR = PermissionsBitField.resolve(PermissionFlagsBits.Administrator)