import { readdir as read } from 'fs'
import { EventEmitter } from 'events'
import { promisify } from 'util'

const readdir = promisify(read)

import Bot from '../../entities/Bot'

export default class EventManager {
    constructor(
        private client: Bot
    ) {}

    private handlers = new Array()
    private customHandlers = new Array()

    public async handle(): Promise<void> {
        const handler = await readdir('./src/events')
        for (var prop of handler.filter(e => e !== 'custom')) {
            const { default: event } = await import(`../events/${prop}`)

            this.handlers.push(event)
        }

        const customHandler = await readdir('./src/events/custom')
        for (var prop of customHandler) {
            const { default: event } = await import(`../events/custom/${prop}`)

            this.customHandlers.push(event)
        }
        
        await this.hookEvents()
    }

    public async hookEvents(): Promise<void> {
        for (var handler of this.handlers) {
            this.client.on(
                handler.name,
                handler.invoke
                    .bind(null, this.client)
            )

            console.log(`[LOADING] Event: ${handler.name}`)
        }

        for (var handler of this.customHandlers) {
            this.client.eventHook.on(
                handler.name,
                handler.invoke
                    .bind(null, this.client)
            )

            console.log(`[LOADING] Custom event: ${handler.name}`)
        }
    }
}
