import { cyan, yellow, red, gray } from 'colors/safe'
import { format } from 'util'
import { getTime } from '../Util/Common'

export default class Logger {
    private constructor() {}

    public static info(message: string, ...args: any[]): void {
        console.info(`[${cyan('INFO')}] ${gray(getTime())} ${format(message, ...args)}`)
    }
    public static warn(message: string, ...args: any[]): void {
        console.warn(`[${yellow('WARN')}] ${gray(getTime())} ${format(message, ...args)}`)
    }
    public static error(message: string, ...args: any[]): void {
        console.error(`[${red('ERROR')}] ${gray(getTime())} ${format(message, ...args)}`)
    }
}