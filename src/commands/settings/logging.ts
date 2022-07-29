import { DocumentType } from '@typegoose/typegoose'
import { ChannelType, PermissionFlagsBits } from 'discord.js'
import GuildSettingsModel, { GuildSettings, Logging } from '../../Models/GuildSettingsModel'
import SlashCommand from '../../Structures/SlashCommand'
import { ChannelOption, StringOption, SubcommandOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

const SETTINGS_CACHE = new Map<string, DocumentType<GuildSettings>>()

export default new SlashCommand({
    name: 'logging', category: 'settings',
    description: 'Configures the logging for this server.',
    memberPerms: PermissionFlagsBits.ManageGuild,
    options: [
        new SubcommandOption('set', 'Sets {channel} as for logging {log_type}.', [
            new ChannelOption('channel', 'The channel to set.', { required: true, channelTypes: [ChannelType.GuildText] }),
            new StringOption('log_type', 'The type of logs this channel will log.', { 
                required: true,
                choices: [
                    { name: 'Activity', value: 'activity' },
                    { name: 'Moderation', value: 'moderation' }
                ]
            })
        ])
    ]
}, async (client, interaction) => {
    let { options, guild, user } = interaction

    if (!SETTINGS_CACHE.has(guild.id))
        SETTINGS_CACHE.set(guild.id, await GuildSettingsModel.get(guild.id))

    let guildSettings = SETTINGS_CACHE.get(guild.id)!

    switch (options.getSubcommand()) {
        case 'set': {
            let channel = options.getChannel('channel', true)
            let logType = options.getString('log_type', true) as keyof Logging

            await guildSettings.setLogging(logType, channel.id)

            await interaction.reply({
                embeds: [Embed.default('Channel set', `${channel} will now be used for ${logType} logging.`, user)]
            })
        }
    }
})