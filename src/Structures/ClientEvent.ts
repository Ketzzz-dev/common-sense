import { ClientEvents } from "discord.js"
import CommonSenseClient from "./CommonSenseClient"

export default class<K extends keyof ClientEvents> {
    public readonly once: boolean

    public constructor (
        public readonly key: K,
        public readonly emit: (client: CommonSenseClient, ...args: ClientEvents[K]) => void,
        once?: boolean
    ) { this.once = once ?? false }
}