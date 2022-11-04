import { PermissionFlagsBits, PermissionsBitField } from 'discord.js'

export const MODERATOR = PermissionsBitField.resolve([
	PermissionFlagsBits.BanMembers, PermissionFlagsBits.ChangeNickname,
	PermissionFlagsBits.DeafenMembers, PermissionFlagsBits.KickMembers,
	PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageNicknames,
	PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.MoveMembers,
	PermissionFlagsBits.MuteMembers, PermissionFlagsBits.PrioritySpeaker,
	PermissionFlagsBits.ViewAuditLog, PermissionFlagsBits.UseApplicationCommands
])
export const MS_REGEXP = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i
export const MAX_UNSINGED_INT = 2_147_483_647

export async function defaultImport<T>(path: string): Promise<T> {
	return (await import(path))?.default

}
export function getTime(): string {
	let date = new Date

	return [date.getHours(), date.getMinutes(), date.getSeconds()]
		.map(n => n.toString().padStart(2, '0'))
		.join(':')
}