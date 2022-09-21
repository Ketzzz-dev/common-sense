import { gray, cyan, red, yellow } from 'colors/safe'
import { getTime } from './Common'
import { format } from 'util'

export namespace Logger {
	export function clear(): void {
		console.clear()
	}
	export function info(message: string): void {
		console.info(`[${cyan('INFO')}] ${gray(getTime())} ${message}`)
	}
	export function warn(message: string): void {
		console.warn(`[${yellow('WARN')}] ${gray(getTime())} ${message}`)
	}
	export function error(message: string, error?: any): void {
		console.error(`[${red('ERROR')}] ${gray(getTime())} ${format(message, error)}`)
	}
}