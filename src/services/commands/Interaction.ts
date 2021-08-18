import { CommandInteraction, Permissions } from 'discord.js'
import { IInteractionCommand } from '../../interfaces/IInteraction'
import { readdir } from 'fs'

import Bot from '../../entities/Bot'
import config from '../../config'
import { Validator } from './Validator'

export default class InteractionCommandManager {
    constructor(
        private client: Bot
    ) {}

    private commands = new Map<String, Omit<IInteractionCommand, 'permissions'>>()
    private interactions = new Array()
    private validator = new Validator(this.commands)

    public async handle(): Promise<void> {
        readdir('./src/commands/interactions', (err, props) => {
            if (err)  throw new TypeError(err.message)
            for (var prop of props) {
                const { default: command } = await import(`../commands/interactions/${prop}`)

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
            }
        })
    }

    public async invoke(interaction: CommandInteraction): Promise<any> {
        if (!interaction.isCommand()) return
        const member = await this.client.memberRepository.getOrCreate(message.member)
        const user = await this.client.userRepository.getOrCreate(message.author)
        const command = await this.validator.findCommand(message)

        if (!command) return interaction.reply({
            content: 'O comando não existe.',
            ephemeral: true
        })

        try {
            this.validator.checkCommand({
                context: interaction,
                command,
                user
            })
        } catch(err) {
             return interaction.reply({
                content: err.message,
                ephemeral: true
            })
        }

        await command.invoke({ client: this.client, interaction })
    }
}
