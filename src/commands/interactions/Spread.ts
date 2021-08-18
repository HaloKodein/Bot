import {
    IInteractionCommand,
    IInteractionConfig,
    IInteractionContext
} from '../../interfaces/IInteraction'
import {
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu,
    Message,
    Interaction,
    TextChannel,
    SelectMenuInteraction
} from 'discord.js'

export default new class Clear implements IInteractionCommand {
    public config: IInteractionConfig = {
        name: 'spread',
        description: 'Envie uma mensagem de divulgação no canal mencionado.',
        permissions: ['MANAGE_MESSAGES'],
        maintenance: false,
        disabled: false,
        options: [
            {
                name: 'message',
                description: 'A mensagem que sera enviada no canal.',
                type: 'STRING',
                required: true
            }
        ]
    }

    public async invoke({ client, interaction }: IInteractionContext): Promise<any> {
        const messageTarget = interaction.options.getString('message')
        const channels = interaction.guild.channels.cache
            .filter(channel =>
                channel.type === 'GUILD_TEXT' &&
                channel.permissionsFor(interaction.user.id).has('SEND_MESSAGES') &&
                channel.permissionsFor(client.user.id).has('SEND_MESSAGES')
            )

        if (!channels.size) return interaction.reply({
            content: `Sem permissão para enviar mensagens no canal.`,
            ephemeral: true
        })

        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('channel')
                    .setPlaceholder('Selecione o canal')
                    .addOptions(
                        channels.map(channel => Object({
                            label: channel.name,
                            value: channel.id
                        }))
                    )
            )
        
        const spread = new MessageEmbed()
            .setTitle(`Divulgação`)
            .setDescription(messageTarget)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setColor(0xff0000)
            .setFooter(
                `Requisitado por ${interaction.user.username}`,
                interaction.user.avatarURL({ dynamic: true 
            }))
        
        const reply = await interaction.reply({
            content: 'Selecione o canal para enviar.',
            components: [actionRow],
            fetchReply: true
        }) as Message
        
        const filter = (i: Interaction) => i.user.id === interaction.user.id
        const collector = reply.createMessageComponentCollector({
            time: (3 * 60) * 1000,
            max: 1,
            filter
        })

        collector
        .on('collect', async (i: SelectMenuInteraction) => {
            const id = i.values[0]
            const channel = interaction.guild.channels.cache
                .get(String(id)) as TextChannel

            await channel.send({ embeds: [spread] })

            await interaction.editReply({
                content: 'Mensagem enviada com sucesso!',  components: []
            })
        })
        .on('end', async (collected, reason) => {
            if (reason === 'time') await interaction.editReply({
                content: 'O tempo para selecionar o canal acabou.',
                components: []
            })

            setTimeout(async () => await interaction.deleteReply(), 5000)
        })
    }
}
