import {
    IInteractionCommand,
    IInteractionConfig,
    IInteractionContext
} from '../../interfaces/IInteraction'

import { MessageEmbed, TextChannel } from 'discord.js'

export default new class Clear implements IInteractionCommand {
    public config: IInteractionConfig = {
        name: 'clear',
        description: 'Apaga as mensagens do canal de acordo a quantidade escolhida.',
        permissions: ['MANAGE_MESSAGES'],
        maintenance: false,
        disabled: false,
        options: [
            {
                name: 'amount',
                description: 'Digite á quantidade.',
                type: 'STRING',
                required: true
            }
        ]
    }

    public async invoke({ interaction }: IInteractionContext): Promise<any> {
        const amount = Number(interaction.options
            .getString('amount'))

        const channel = interaction
            .channel as TextChannel
        
        if (isNaN(amount)) return interaction.reply({
            content: 'Por favor, digite um número válido.',
            ephemeral: true
        })

        const cleanedMessages = await channel
            .bulkDelete(amount)

        const cleaned = new MessageEmbed()
            .setDescription(`${cleanedMessages.size} mensagens apagadas!`)
            .setColor(0xff0000)

        await interaction.reply({
            embeds: [cleaned],
            ephemeral: true
        })
    }
}
