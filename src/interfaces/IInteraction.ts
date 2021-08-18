import { CommandInteraction, PermissionString } from 'discord.js'
import Bot from '../entities/Bot'

export interface IInteractionOptions {
    name: string,
    description: string,
    type:  string,
    required: boolean
}

export interface IInteractionContext {
    client: Bot,
    interaction: CommandInteraction
}

export interface IInteractionConfig {
    name: string,
    description: string,
    options?: IInteractionOptions[],
    permissions: PermissionString[],
    maintenance: boolean,
    disabled: boolean
}

export interface IInteractionCommand {
    config?: IInteractionConfig,
    invoke({ ...context }: IInteractionContext): Promise<any>
}
