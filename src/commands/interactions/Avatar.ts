import {
    IInteractionCommand,
    IInteractionConfig,
    IInteractionContext
} from '../../interfaces/IInteraction'

import { MessageEmbed } from 'discord.js'

export default new class Avatar implements IInteractionCommand {
    public config: IInteractionConfig = {
        name: 'avatar',
        description: 'Envia o avatar do usuário mencionado.',
        permissions: [],
        maintenance: false,
        disabled: false,
        options: [
            {
                name: 'target',
                description: 'Mencione o usuário.',
                type: 'USER',
                required: false
            }
        ]
    }

    public async invoke({ interaction }: IInteractionContext): Promise<any> {
        const user = interaction.options
            .getUser('target') || interaction.user

        const avatarURL = user.avatarURL({
            dynamic: true,
            size: 2048,
            format: 'png'
        })

        const avatar = new MessageEmbed()
            .setDescription(`Avatar de [${user.username}](${avatarURL})`)
            .setColor(0xff0000)
            .setImage(avatarURL)
            .setFooter(
                `Requisitado por ${interaction.user.username}`,
                interaction.guild.iconURL({ dynamic: true }
            ))

        await interaction.reply({
            embeds: [avatar]
        })
    }
}
