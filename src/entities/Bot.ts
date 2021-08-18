import { Client, Intents } from 'discord.js'
import EventManager from '../services/events/Event'
import CommandManager from '../services/commands/Command'
import InteractionCommandManager from '../services/commands/Interaction'
import UserRepository from '../data/repositories/user/Repository'
import GuildRepository from '../data/repositories/guild/Repository'
import MemberRepository from '../data/repositories/member/Repository'
import { EventEmitter } from 'stream'

export default class Bot extends Client {
    constructor(
    ) {
        super({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_BANS,
                Intents.FLAGS.GUILD_INTEGRATIONS,
                Intents.FLAGS.GUILD_INVITES,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        })
    }
    
    public eventHook = new EventEmitter()
    public memberRepository = new MemberRepository(this)
    public userRepository = new UserRepository(this)
    public guildRepository = new GuildRepository(this)

    public commandManager = new CommandManager(this)
    public eventManager = new EventManager(this)
    public interactionCommandManager = new InteractionCommandManager(this)
}
