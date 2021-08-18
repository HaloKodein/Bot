import { IEvent } from '../interfaces/IEvent'
import { Message } from 'discord.js'

import Bot from '../entities/Bot'

export default new class MessageCreate implements IEvent {
    public name = 'messageCreate'
    public async invoke(client: Bot, message: Message): Promise<any> {
        await client.commandManager
            .invoke(message)
    }
}
