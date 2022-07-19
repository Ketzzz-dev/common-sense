import { createLogger, format } from "winston"
import { Console } from "winston/lib/winston/transports"

export default createLogger({
    transports: [
        new Console()
    ],
    format: format.combine(
        format.timestamp({ format: 'HH:mm:ss' }),
        format.printf(info => `[${info.level.toUpperCase()}] ${info.timestamp} ${info.message}`)
    )
})