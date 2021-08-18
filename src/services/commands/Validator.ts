import { Interaction, Message, Permissions } from 'discord.js'
import { ICommand } from '../../interfaces/ICommand'
import { IVerifyPermissions } from '../../interfaces/IVerifyPermissions'
import { UserDocument } from '../../data/models/User'
import config from '../../config'

interface IParseMessage {
    args: string[]
}

interface IContextMessageParser {
    message: Message,
    prefix: string
}

interface IContextCheckCommand {
    context: Message | Interaction,
    command: ICommand,
    user: UserDocument
}

export class Validator {
    constructor(
        private commands: Map<String, ICommand>,
        private aliases: Map<String, String>
    ) {}

    public async findCommand({ content }: Message): Promise<ICommand> {
        const target = content
            .split(/ +/g)
            .shift()
            .toLowerCase()

        return this.commands.get(target) ??
            this.commands.get(this.aliases.get(target))
    }

    public parseMessage({ message, prefix }: IContextMessageParser): IParseMessage {
        const args = message.content
            .slice(prefix.length)
            .split(/ +/g)
        
        return { args }
    }

    public async checkCommand({ context, command, user }: IContextCheckCommand): Promise<void> {
        const { permissions } = command.config
        const { isAdmin } = user.settings
        const getMember = (id: string) => context.guild.members.cache.get(id)

        if (!getMember(context.member.user.id).permissions.has([ ...permissions ])
            && !getMember(client.user.id).permissions.has([ ...permissions ])) return context.channel
            .send({
                content: `Falta as permissões ${permissions.map(e => e).join(', ')}`
            })
    }
}
