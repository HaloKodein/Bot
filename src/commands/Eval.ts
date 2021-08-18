import {
    ICommand,
    ICommandConfig,
    ICommandContext
} from '../interfaces/ICommand'
import {
    MessageEmbed
} from 'discord.js'

import config from '../config'

export default new class Clear implements ICommand {
    public config: ICommandConfig = {
        name: 'eval',
        usage: `${config.prefix}eval <code>`,
        description: 'Executa um código javascript.',
        aliases: ['e'],
        permissions: ['OWNER'],
        maintenance: false,
        disabled: false,
        onlyGuilds: true
    }

    public async invoke({ message, args, client }: ICommandContext): Promise<any> {
        const code = args.join(' ')
        const evalEmbed = new MessageEmbed()
            .setFooter(
                `Requisitado por ${message.author.username}`,
                message.author.avatarURL({ dynamic: true })
            )
            .setColor(0x2f3136)

        function clean(text) {
            if (typeof(text) === "string") return text
                .replace(/`/g, "`" + String.fromCharCode(8203))
                .replace(/@/g, "@" + String.fromCharCode(8203))
            else return text
        }

        try {
            const result = await eval(code)

            evalEmbed
                .setDescription(`Entrada:\n\`\`\`js\n${code}\n\`\`\`Saida:\n\`\`\`js\n${clean(result)}\n\`\`\``)

            message.channel.send({ embeds: [evalEmbed] })
        } catch (err) {
            evalEmbed
                .setDescription(`Entrada:\n\`\`\`js\n${code}\n\`\`\`\nSaida:\n\`\`\`js\n${clean(err)}\n\`\`\``)

            return  message.channel.send({ embeds: [evalEmbed] })
        }
    }
}
