import { ApplicationCommandData } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default new class Ready implements IEvent {
    public name = 'ready'
    public async invoke(client: Bot): Promise<any> {
        const commands = client.application.commands
        
        await commands.set(
            client.interactionCommandManager
                .interactions as ApplicationCommandData[]
        )

        client.user.setActivity('Use a slash command.', { url: 'https://www.twitch.tv/Krowkaz', type: 'STREAMING' })
            
        console.log(`[CLIENT] Ready in ${client.user.username}`)
    }
}
