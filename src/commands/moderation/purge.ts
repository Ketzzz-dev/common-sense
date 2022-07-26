// import { Collection, GuildTextBasedChannel, Message } from 'discord.js'
// import Command from '../../Structures/Command'
// import { IntegerOption, SubcommandOption } from '../../Structures/CommandOptions'
// import { MODERATOR } from '../../Util/Common'

// const AMOUNT_OPTION = new IntegerOption('amount', 'The amount of messages to purge.', { required: true, minValue: 1, maxValue: 1000 })

// export default new Command({
//     name: 'purge', category: 'moderation',
//     description: 'Deletes `amount` messages from the provided options.',
//     permissions: MODERATOR,
//     options: [
//         new SubcommandOption('normal', 'Purges messages from this channel', [AMOUNT_OPTION]),
//         new SubcommandOption('bots', 'Purges messages sent by bots from this channel.', [AMOUNT_OPTION]),
//         new SubcommandOption('humans', 'Purges messages sent by humans from this channel.', [AMOUNT_OPTION]),
//         new SubcommandOption('user', 'Purges messages sent by `user` from this channel.', [AMOUNT_OPTION])
//     ]
// }, async (client, interaction) => {
//     let { options, channel, user } = interaction

//     let amount = options.getInteger('amount', true)

//     let messages = await channel!.messages.fetch({ limit: amount })

//     switch (options.getSubcommand()) {
//         case 'normal': return await normal(channel!, messages)
//     }
// })

// async function normal(channel: GuildTextBasedChannel, messages: Collection<string, Message>): Promise<void> {
//     let deletedMessages = await channel.bulkDelete(messages)
// }
// async function bots(messages: Collection<string, Message>): Promise<void> {

// }