import { SavedGuild, GuildDocument } from '../../models/Guild'
import DatabaseWrapper from '../../Database'
import SnowflakeEntity from '../../../entities/Snowflake'
import Bot from '../../../entities/Bot'

export default class GuildRepository extends DatabaseWrapper<SnowflakeEntity, GuildDocument> {
  constructor(
    private client: Bot
  ) { super() }

  async getOrCreate({ id }: SnowflakeEntity) {
    const savedGuild = await SavedGuild.findById(id)

    return savedGuild ?? await this.create({ id })
  }

  async create({ id }: SnowflakeEntity) {
    return new SavedGuild({ _id: id }).save()
  }

  async delete({ id }: SnowflakeEntity) {
    return await SavedGuild.findByIdAndDelete(id)
  }
}