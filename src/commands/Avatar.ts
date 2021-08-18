import {
    ICommand,
    ICommandConfig,
    ICommandContext
} from '../interfaces/ICommand'

import config from '../config'
import { MessageEmbed } from 'discord.js'

export default new class Avatar implements ICommand {
    public config: ICommandConfig = {
        name: 'avatar',
        usage: `${config.prefix}avatar @user#0000`,
        description: 'Envia o avatar do usuário mencionado.',
        aliases: [],
        permissions: [],
        maintenance: false,
        disabled: false,
        onlyGuilds: true,
    }

    public async invoke({ message }: ICommandContext): Promise<any> {
        const user = message.mentions.users
            .first() || message.author

        const avatarURL = user.avatarURL({
            dynamic: true,
            size: 2048,
            format: 'png'
        })

        const avatar = new MessageEmbed()
            .setDescription(`Avatar of [${user.username}](${avatarURL})`)
            .setImage(avatarURL)
            .setColor(0xff0000)
            .setFooter(
                `Request by ${message.author.username}`,
                message.guild.iconURL({ dynamic: true
            }))

        message.channel.send({
            embeds: [avatar]
        })
    }
}
