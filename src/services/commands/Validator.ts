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
        private aliases?: Map<String, String>
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

        if (command.config.maintenance)
            throw new Error('O comando está em manutenção.')

        if (command.config.disabled)
            throw new Error('O comando está desativado.')

        if (permissions[0] !== 'OWNER')
            if (!getMember(context.member.user.id).permissions.has(permissions))
                throw new Error(`Você precisa das permissões de ${permissions.map(e => e).join(', ')}`)

            if (!getMember(client.user.id).permissions.has(permissions))
                throw new Error(`Eu preciso das permissões de ${permissions.map(e => e).join(', ')}`)
        else
            if (!user.settings.isAdmin)
                throw new Error(`Você não tem permissão para usar esse comando.`)
    }
}
