import { ApplicationCommandOptionType, PermissionFlagsBits } from 'discord-api-types/v10'
import { MessageEmbed } from 'discord.js'
import { Command } from '../../Structures/Command'
import { MODERATOR } from '../../util/Permissions'

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

    let messages = await channel!.messages.fetch({ limit: amount }) // for some reason, it deletes one message less if `target` is specified.
    
    if (target) {
        let { id } = target

        messages = messages.filter(message => message.author.id == id)
    }

    let { size } = await channel!.bulkDelete(messages, true)

    await interaction.reply({
        embeds: [
            new MessageEmbed({
                title: 'Messages purged!', color: 'RED',
                description: target ? `Purged ${size} messages from ${target.toString()}.` : `Purged ${size} from this channel.`,
                footer: { text: `Moderator: ${user.tag}` }
            })
        ]
    })
    
    setTimeout(async () => await interaction.deleteReply(), 3000)
})