import { Collection, Message, PermissionFlagsBits } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import { IntegerOption, SubcommandOption, UserOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

const AMOUNT_OPTION = new IntegerOption('amount', 'The amount of messages to purge. 100 if left unspecified.', { minValue: 1, maxValue: 100 })

export default new SlashCommand({
    name: 'purge', category: 'moderation',
    description: 'Deletes {amount} of messages with the provided options.',
    memberPerms: PermissionFlagsBits.ManageMessages,
    botPerms: PermissionFlagsBits.ManageMessages,
    options: [
        new SubcommandOption('normal', 'Purges messages from this channel.', [AMOUNT_OPTION]),
        new SubcommandOption('bots', 'Purges messages sent by bots from this channel.', [AMOUNT_OPTION]),
        new SubcommandOption('humans', 'Purges messages sent by humans from this channel.', [AMOUNT_OPTION]),
        new SubcommandOption('user', 'Purges messages sent by {user} from this channel.', [
            new UserOption('target', 'The target user to purge messages from.', { required: true }),
            AMOUNT_OPTION
        ])
    ]
}, async (client, interaction) => {
    let { options, channel, user } = interaction

    let amount = options.getInteger('amount') ?? 100
    let messages!: Collection<string, Message>

    switch (options.getSubcommand()) {
        case 'normal': {
            messages = await channel!.messages.fetch({ limit: amount })

            break
        }
        case 'bots': {
            messages = (await channel!.messages.fetch({ limit: amount }))
                .filter(m => m.author.bot)

            break
        }
        case 'humans': {
            messages = (await channel!.messages.fetch({ limit: amount }))
            .filter(m => !m.author.bot)

            break
        }
        case 'user': {
            let target = options.getUser('target', true)

            messages = (await channel!.messages.fetch({ limit: amount }))
                .filter(m => m.author.id == target.id)
        }
    }

    let purged = await channel!.bulkDelete(messages, true)

    await interaction.reply({
        embeds: [Embed.default('Messages purged', `${purged.size.toLocaleString()} messages were purged.`, user)]
    })
})