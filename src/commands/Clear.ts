import {
    ICommand,
    ICommandConfig,
    ICommandContext
} from '../interfaces/ICommand'
import {
    MessageEmbed,
    TextChannel
} from 'discord.js'

import config from '../config'

export default new class Clear implements ICommand {
    public config: ICommandConfig = {
        name: 'clear',
        usage: `${config.prefix}clear <quantidade>`,
        description: 'Apaga as mensagens do canal de acordo a quantidade escolhida.',
        aliases: [],
        permissions: ['MANAGE_MESSAGES'],
        maintenance: false,
        disabled: false,
        onlyGuilds: true
    }

    public async invoke({ message, args }: ICommandContext): Promise<any> {
        const amount = Number(args[0])
        const channel = message
            .channel as TextChannel

        if (!amount) return message.channel
            .send('Por favor, digite a quantidade.')

        if (isNaN(amount)) return message.channel
            .send('Por favor, digite um número válido.')

        const cleanedMessages = await channel
            .bulkDelete(amount)

        const cleaned = new MessageEmbed()
            .setDescription(`${cleanedMessages.size} mensagens apagadas.`)
            .setColor(0xff0000)

        const target = await message.channel.send({
            embeds: [cleaned]
        })
        
        setTimeout(() => target.delete(), 15 * 1000)
    }
}
