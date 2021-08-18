import { Guild } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default new class GuildRemove implements IEvent {
    public name = 'guildCreate'
    public async invoke(client: Bot, guild: Guild): Promise<any> {
        try {
            await client.eventManager.guildRepository.getOrCreate(guild)

            console.log(`[DATABASE] Create guild ${guild.name} (${guild.id})`)
        } catch(err) {
            return console.error(`[DATABASE] Create guild error: ${err.message}`)
        }
    }
}
