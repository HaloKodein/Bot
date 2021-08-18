import { Guild } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default new class GuildDelete implements IEvent {
    public name = 'guildDelete'
    public async invoke(client: Bot, guild: Guild): Promise<any> {
        try {
            await client.eventManager.guildRepository.delete(guild)

            console.log(`[DATABASE] Delete guild ${guild.name} (${guild.id})`)
        } catch(err) {
            return console.error(`[DATABASE] Delete guild error: ${err.message}`)
        }
    }
}
