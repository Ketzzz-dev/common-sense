import { ChannelType, PermissionFlagsBits } from 'discord.js'
import GuildSettingsModel, { Logging } from '../../Models/GuildSettingsModel'
import SlashCommand from '../../Structures/SlashCommand'
import { ChannelOption, StringOption, SubcommandOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'logging', category: 'settings',
    description: 'Configures the logging for this server.',
    memberPerms: PermissionFlagsBits.ManageGuild,
    options: [
        new SubcommandOption('set', 'Sets {channel} as for logging {log_type}.', [
            new StringOption('log_type', 'The type of logs this channel will log.', { 
                required: true,
                choices: [
                    { name: 'Activity', value: 'activity' },
                    { name: 'Moderation', value: 'moderation' }
                ]
            }),
            new ChannelOption('channel', 'The channel to set. None if left unspecified.', { channelTypes: [ChannelType.GuildText] })
        ]),
        new SubcommandOption('ignore', 'Ignores {channel} from logging {log_type} logs.', [
            new StringOption('log_type', 'The type of logs this channel will log.', { 
                required: true,
                choices: [
                    { name: 'Activity', value: 'activity' },
                    { name: 'Moderation', value: 'moderation' }
                ]
            }),
            new ChannelOption('channel', 'The channel to ignore.', { required: true })
        ])
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    let guildSettings = await GuildSettingsModel.get(guild.id)

    switch (options.getSubcommand()) {
        case 'set': {
            let logType = options.getString('log_type', true) as keyof Logging
            let channel = options.getChannel('channel')

            await guildSettings.setLogging(logType, channel?.id)
            await interaction.reply({
                embeds: [Embed.default('Channel set', `${channel} will now be used for ${logType} logging.`, user)]
            })

            break
        }
        case 'ignore': {
            let logType = options.getString('log_type', true) as keyof Logging
            let channel = options.getChannel('channel', true)
            break
        }
    }
})