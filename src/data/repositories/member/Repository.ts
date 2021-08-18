import { SavedMember, MemberDocument } from '../../models/Member'
import { GuildMember } from 'discord.js'
import DatabaseWrapper from '../../Database'
import Bot from '../../../entities/Bot'

export default class MemberRepository extends DatabaseWrapper<GuildMember, MemberDocument> {
  constructor(
    private client: Bot
  ) { super() }

  async getOrCreate(member: GuildMember) {
    const savedMember = await SavedMember.findById(member.user.id)

    return savedMember ?? await this.create(member)
  }

  async create(member: GuildMember) {
    return new SavedMember({
      _id: member.id,
      guildId: member.guild.id
    }).save()
  }

  async delete(member: GuildMember) {
    return await SavedMember.findByIdAndDelete({
      _id: member.user.id
    })
  }
}