
export const MAX_32_BIT_SIGNED = 2_147_483_647

export function setLongTimeout<T extends any[]>(callback: (...args: T) => void, timeout: number, ...args: T) {
    let iterations = 0
    let maxIterations = timeout / MAX_32_BIT_SIGNED
    let timer: NodeJS.Timer

    return timer = setInterval(function onInterval() {
        iterations++

        if (iterations > maxIterations) {
            clearInterval(timer)
            callback(...args)
        }
    })
}