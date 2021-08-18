import { GuildMember } from 'discord.js'
import { IEvent } from '../interfaces/IEvent'

import Bot from '../entities/Bot'

export default new class GuildMemberAdd implements IEvent {
    public name = 'guildMemberAdd'
    public async invoke(client: Bot, member: GuildMember): Promise<any> {
        try {
            await client.eventManager.memberRepository.getOrCreate(member)

            console.log(`[DATABASE] Create member ${member.user.username} (${member.id})`)
        } catch(err) {
            return console.error(`[DATABASE] Create member error: ${err.message}`)
        }
    }
}
