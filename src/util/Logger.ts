import { createLogger, format } from "winston"
import { Console } from "winston/lib/winston/transports"

// We're gonna be using Winston to log our necessities!
export default createLogger({
    transports: [
        new Console()
    ],
    // Feel free to change the format of your logs:
    format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(info => `[${info.level.toUpperCase()}] ${info.timestamp} ${info.message}`)
    )
})
