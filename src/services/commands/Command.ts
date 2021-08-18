import { Message, Permissions } from 'discord.js'
import { ICommand } from '../../interfaces/ICommand'
import { readdir } from 'fs'

import Bot from '../../entities/Bot'
import config from '../../config'
import { Validator } from './Validator'

export default class CommandManager {
    constructor(
        private client: Bot
    ) {}

    private commands = new Map<String, ICommand>()
    private aliases = new Map<String, String>()
    private validator = new Validator(this.commands, this.aliases)

    public async handle(): Promise<any> {
        readdir('./src/commands/', (err, props) => {
            if (err) throw new TypeError(err.message)
            for (var prop in props) {
                if (prop.split('.').slice(-1)[0] !== 'ts') return
                const { default: command } = await import(`../commands/${prop}`)

                this.commands.set(command.config.name
                    .toLowerCase(), command)

                command.config.aliases
                    .forEach(alias => {
                        this.aliases
                            .set(alias, command.config.name
                                .toLowerCase())
                    })

                console.log(`[LOADING] Command: ${command.config.name}`)
            }
        })
    }

    public async invoke(message: Message): Promise<any> {
        const guild = await this.client.guildRepository.getOrCreate(message.guild)
        const prefix = guild.settings.prefix ?? config.prefix

        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return

        const member = await this.client.memberRepository.getOrCreate(message.member)
        const user = await this.client.userRepository.getOrCreate(message.author)
        const command = await this.validator.findCommand(message)
        const { args } = this.validator.parseMessage({ message, prefix })

        try { 
            this.validator.checkCommand({
                context: message,
                command,
                user
            })
        } catch(err) {
            return message.channel.send({
                content: err.message
            })
        }

        await command.invoke({
            args,
            message,
            client: this.client
        })
    }
}
