export const MS_REGEXP = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i

export async function defaultImport<T>(path: string): Promise<T> {
	return (await import(path))?.default

}
export function getTime(): string {
	let date = new Date

	return [date.getHours(), date.getMinutes(), date.getSeconds()]
		.map(n => n.toString().padStart(2, '0'))
		.join(':')
}