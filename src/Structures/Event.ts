import { ClientEvents } from "discord.js"
import { CommonSenseClient } from "./Client"

/**
 * The event class.
 */
export class Event<K extends keyof ClientEvents> {
    /**
     * This flag indicates whether the event should only emit once.
     */
    public readonly once: boolean

    /**
     * @param key - The key of the event.
     * @param emit - The event's callback function.
     * @param once - Should the event emit once.
     */
    public constructor(
        public readonly key: K,
        public readonly emit: (client: CommonSenseClient, ...args: ClientEvents[K]) => void,
        once?: boolean
    ) { this.once = once ?? false }
}