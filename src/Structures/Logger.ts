import { cyan, yellow, red, gray } from 'colors/safe'
import { format } from 'util'

export default class Logger {
    private constructor() {}

    private static getTime(): string {
        let date = new Date

        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map(n => n.toString().padStart(2, '0'))
            .join(':')
    }

    public static info(message: string, ...args: any[]): void {
        console.info(`[${cyan('INFO')}] ${gray(this.getTime())} ${format(message, ...args)}`)
    }
    public static warn(message: string, ...args: any[]): void {
        console.warn(`[${yellow('WARN')}] ${gray(this.getTime())} ${format(message, ...args)}`)
    }
    public static error(message: string, ...args: any[]): void {
        console.error(`[${red('ERROR')}] ${gray(this.getTime())} ${format(message, ...args)}`)
    }
}