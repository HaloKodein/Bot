import { CommandInteraction, Permissions } from 'discord.js'
import { IInteractionCommand } from '../../interfaces/IInteraction'
import { IVerifyPermissions } from '../../interfaces/IVerifyPermissions'
import { UserDocument } from '../../data/models/User'
import { readdir } from 'fs'

import Bot from '../../entities/Bot'
import GuildRepository from '../../data/repositories/guild/Repository'
import MemberRepository from '../../data/repositories/member/Repository'
import UserRepository from '../../data/repositories/user/Repository'
import config from '../../config'

export default class InteractionCommandManager {
    constructor(
        private client: Bot
    ) {}

    public commands = new Map<String, Omit<IInteractionCommand, 'permissions'>>()
    public interactions = new Array()

    public async handle(): Promise<void> {
        readdir('./src/commands/interactions', (err, files) => {
            if (err)  throw new TypeError(err.message)
            files.forEach(async props => {
                const { default: command } = await import(`../commands/interactions/${props}`)

                this.interactions.push({
                    name: command.config.name, 
                    description: command.config.description,
                    options: command.config.options,
                    invoke: command.invoke 
                })
                
                this.commands.set(command.config.name, {
                    config: {
                        name: command.config.name, 
                        description: command.config.description,
                        permissions: command.config.permissions,
                        options: command.config.options,
                        maintenance: command.config.maintenance,
                        disabled: command.config.disabled
                    },
                    invoke: command.invoke
                })

                console.log(`[LOADING] Interaction Command: ${command.config.name}`)
            })
        })
    }

    public async invoke(interaction: CommandInteraction): Promise<any> {
        const command = await this.commands.get(interaction.commandName)
        const guild = await this.client.guildRepository.getOrCreate(interaction.guild)
        const member = await this.client.memberRepository.getOrCreate(interaction.guild.members.cache.get(interaction.user.id))
        const user = await this.client.userRepository.getOrCreate(interaction.user)

        if (!interaction.isCommand()) return

        if (!command) return interaction.reply({
            content: 'O comando não existe!',
            ephemeral: true
        })
        
        if (command.config.maintenance) return interaction
            .reply({
                content: 'O comando está em manutenção!',
                ephemeral: true
            })

        if (command.config.disabled) return interaction
            .reply({
                content: 'O comando está desativado!',
                ephemeral: true
            })
        
        if (command.config.permissions.length >= 1) {
            const result = this.verifyPermissions(
                interaction,
                command.config.permissions,
                user
            )
            if (typeof result.memberHasOwnerPermissions === 'boolean') {
                if (!result.memberHasOwnerPermissions) return interaction
                    .reply({
                        content: `Você não tem permissão para usar esse comando.`,
                        ephemeral: true
                    })
            } else {
                if (!result.botHasPermissions) return interaction
                    .reply({
                        content: `O bot precisa das permissões\n\`\`\`${result.permissions
                            .map(e => e).join(',')}\`\`\``,
                            ephemeral: true
                        })

                if (!result.memberHasPermissions) return interaction
                    .reply({
                        content: `Você precisa das permissões\n\`\`\`${result.permissions
                            .map(e => e).join(',')}\`\`\``,
                            ephemeral: true
                        })
            }
        }

        try {
            await command.invoke({ client: this.client, interaction })
        } catch(err) {
             throw new TypeError(err.message)
        }
    }

    private verifyPermissions(interaction: CommandInteraction, permissions: string[], user: UserDocument): IVerifyPermissions {
        let result = {
            botHasPermissions: false,
            memberHasPermissions: false,
            memberHasOwnerPermissions: false,
            permissions: null
        }

        permissions.forEach(permission => {
            if (permission === 'OWNER') {
                if (
                    user.settings.isAdmin ||
                    interaction.user.id === config.owner
                ) result.memberHasOwnerPermissions = true
            
                return result
            } else {
                result.memberHasOwnerPermissions = null
            }

            result.permissions = permissions
            if (interaction.guild.members.cache
                .get(interaction.user.id).permissions
                .has(Permissions.FLAGS[permission])) result
                        .memberHasPermissions = true
                            else result.memberHasPermissions = false
            
            if (interaction.guild.members.cache
                .get(interaction.client.user.id).permissions
                .has(Permissions.FLAGS[permission])) result
                    .botHasPermissions = true
                        else result.botHasPermissions = false
        })

        return result
    }
}
