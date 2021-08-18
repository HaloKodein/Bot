import { Message, PermissionString } from 'discord.js'
import Bot from '../entities/Bot'

export type IUserPermissionString =
    | 'OWNER'
    | 'CREATE_INSTANT_INVITE'
    | 'KICK_MEMBERS'
    | 'BAN_MEMBERS'
    | 'ADMINISTRATOR'
    | 'MANAGE_CHANNELS'
    | 'MANAGE_GUILD'
    | 'ADD_REACTIONS'
    | 'VIEW_AUDIT_LOG'
    | 'PRIORITY_SPEAKER'
    | 'STREAM'
    | 'VIEW_CHANNEL'
    | 'SEND_MESSAGES'
    | 'SEND_TTS_MESSAGES'
    | 'MANAGE_MESSAGES'
    | 'EMBED_LINKS'
    | 'ATTACH_FILES'
    | 'READ_MESSAGE_HISTORY'
    | 'MENTION_EVERYONE'
    | 'USE_EXTERNAL_EMOJIS'
    | 'VIEW_GUILD_INSIGHTS'
    | 'CONNECT'
    | 'SPEAK'
    | 'MUTE_MEMBERS'
    | 'DEAFEN_MEMBERS'
    | 'MOVE_MEMBERS'
    | 'USE_VAD'
    | 'CHANGE_NICKNAME'
    | 'MANAGE_NICKNAMES'
    | 'MANAGE_ROLES'
    | 'MANAGE_WEBHOOKS'
    | 'MANAGE_EMOJIS_AND_STICKERS'
    | 'USE_APPLICATION_COMMANDS'
    | 'REQUEST_TO_SPEAK'
    | 'MANAGE_THREADS'
    | 'USE_PUBLIC_THREADS'
    | 'USE_PRIVATE_THREADS'
    | 'USE_EXTERNAL_STICKERS'


export interface ICommandConfig {
    name: string,
    usage: string,
    description: string,
    aliases: string[],
    permissions: IUserPermissionString[],
    maintenance: boolean,
    disabled: boolean,
    onlyGuilds: boolean
}

export interface ICommandContext {
    client: Bot,
    message: Message,
    args: string[]
}

export interface ICommand {
    config: ICommandConfig,
    invoke({ ...context }: ICommandContext): Promise<any>
}
