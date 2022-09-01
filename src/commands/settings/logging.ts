import { ChannelType, Colors, PermissionFlagsBits, TextChannel } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import { ChannelOption, StringOption, SubcommandOption } from '../../Structures/SlashCommandOptions'
import { capitalize } from '../../Util/Common'
import Embeds from '../../Util/Embeds'

export default new SlashCommand({
    name: 'logging', category: 'settings',
    description: 'Configures the logging system for this server.',
    memberPerms: [PermissionFlagsBits.ManageGuild],
    options: [
        new SubcommandOption('set', 'Sets the given channel for logging.', [
            new StringOption('type', 'The type of event to be logged.', {
                required: true, choices: [
                    { name: 'activity', value: 'activity' },
                    { name: 'moderation', value: 'moderation' }
                ]
            }),
            new ChannelOption('channel', 'The channel to set for logging, sets to none if left unspecified.', {
                channelTypes: [ChannelType.GuildText]
            })
        ]),
        new SubcommandOption('ignore', 'Adds a given channel to the list of ignored channels for logging.', [
            new StringOption('type', 'The type of event to be ignored.', {
                required: true, choices: [
                    { name: 'activity', value: 'activity' },
                    { name: 'moderation', value: 'moderation' }
                ]
            }),
            new ChannelOption('channel', 'The channel to add to the list, removes if it\'s already in the list.', {
                required: true, channelTypes: [ChannelType.GuildText]
            })
        ])
    ]
}, async (client, interaction) => {
    let { prisma } = client
    let { guildId, options } = interaction

    let settings = await prisma.guildLoggingSettings.findFirst({ where: { id: guildId } }) ??
        await prisma.guildLoggingSettings.create({ data: { id: guildId } })

    switch (options.getSubcommand()) {
        case 'set': {
            let type = options.getString('type', true)
            let channel = options.getChannel('channel')

            await prisma.guildLoggingSettings.update({
                where: { id: guildId },
                data: type == 'activity' ?
                    { activityLogs: channel?.id ?? null } :
                    { moderationLogs: channel?.id ?? null }
            })

            return await interaction.reply({
                embeds: [Embeds.info(`${capitalize(type)} logs is now set to ${channel}.`)]
            })
        }
        case 'ignore': {
            let type = options.getString('type', true)
            let channel = options.getChannel('channel', true)

            let ignoredIndex = type == 'activity' ?
                settings.activityIgnored.indexOf(channel.id) :
                settings.moderationIgnored.indexOf(channel.id)

            if (ignoredIndex < 0) {
                await prisma.guildLoggingSettings.update({
                    where: { id: guildId },
                    data: type == 'activity' ?
                        { activityIgnored: [...settings.activityIgnored, channel.id] } :
                        { moderationIgnored:  [...settings.moderationIgnored, channel.id] }
                })

                return await interaction.reply({
                    embeds: [Embeds.info(`Added ${channel} to the ignored list.`)]
                })
            } else {
                await prisma.guildLoggingSettings.update({
                    where: { id: guildId },
                    data: type == 'activity' ?
                        { activityIgnored: settings.activityIgnored.splice(ignoredIndex, 1) } :
                        { moderationIgnored: settings.moderationIgnored.splice(ignoredIndex, 1) }
                })

                return await interaction.reply({
                    embeds: [Embeds.info(`Removed ${channel} from the ignored list.`)]
                })
            }
        }
    }
})