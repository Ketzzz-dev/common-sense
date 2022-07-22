import { ApplicationCommandOptionType, EmbedBuilder } from 'discord.js'
import { Command } from '../../Structures/Command'
import { MODERATOR } from '../../Util/Common'

export default new Command({
    name: 'purge', category: 'moderation',
    description: 'Deletes `amount` messages from the channel or `target` if provided.',
    permissions: MODERATOR,
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'amount', description: 'The amount of messages to delete.',
            required: true, min_value: 1
        },
        {
            type: ApplicationCommandOptionType.User,
            name: 'target', description: 'The target user to delete messages from.'
        }
    ]
}, async (client, interaction) => {
    let { options, channel, user } = interaction

    let amount = options.getInteger('amount', true)
    let target = options.getUser('target')

    let messages = await channel!.messages.fetch({ limit: amount })
    
    if (target) {
        let { id } = target

        messages = messages.filter(message => message.author.id == id)
    }

    let { size } = await channel!.bulkDelete(messages, true)

    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Messages Purged!').setColor('Blue')
                .setDescription(target ? `Purged ${size} messages from ${target.toString()}.` : `Purged ${size} from this channel.`)
                .setFooter({ text: `Moderator: ${user.tag}` })
        ]
    })
    
    setTimeout(async () => await interaction.deleteReply(), 3000)
})