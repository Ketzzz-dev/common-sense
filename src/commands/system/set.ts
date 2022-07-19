import { ApplicationCommandOptionType, ChannelType, EmbedBuilder } from 'discord.js'
import { IChannelSettings, IRoleSettings } from '../../models/GuildSettings'
import { Command } from '../../Structures/Command'
import { getGuildSettings } from '../../Util/DB'
import { ADMINISTRATOR, MODERATOR } from '../../Util/Permissions'

export default new Command({
    name: 'set', category: 'system',
    description: 'Assigns a functionality to the provided setting.',
    permissions: ADMINISTRATOR,
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'channel', description: 'Assigns a functionality to a channel.',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'functionality', description: 'The functionality to assign.',
                    required: true, choices: [
                        { name: 'Activity Logs', value: 'activity_logs' },
                        { name: 'Moderation Logs', value: 'moderation_logs' },
                        { name: 'Bot Spam', value: 'bot_spam' },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Channel,
                    name: 'channel', description: 'The channel to assign functionality to.',
                    required: true, channel_types: [ChannelType.GuildText]
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'role', description: 'Assigns a functionality to a role.',
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: 'functionality', description: 'The functionality to assign.',
                    required: true, choices: [
                        { name: 'Moderator', value: 'moderator' },
                        { name: 'Administrator', value: 'administrator' },
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Role,
                    name: 'role', description: 'The role to assign functionality to.',
                    required: true
                },
                {
                    type: ApplicationCommandOptionType.Boolean,
                    name: 'set-permissions', description: 'Specifies whether or not to set default permissions for the role.'
                }
            ]
        }
    ]
}, async (client, interaction) => {
    let { guild, options, user } = interaction
    let settings = await getGuildSettings(guild.id)

    switch (options.getSubcommand(true)) {
        case 'channel': {
            let functionality = options.getString('functionality', true)
            let channel = options.getChannel('channel', true)

            settings.channels[functionality as keyof IChannelSettings] = channel.id

            await settings.save()

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Channel Set!').setColor('Yellow')
                        .setDescription(`${channel} will now be used as \`${functionality}\``)
                        .setFooter({ text: `Administrator: ${user.tag}` })
                ]
            })

            break
        }
        case 'role': {
            let functionality = options.getString('functionality', true)
            let role = options.getRole('role', true)
            let setPerms = options.getBoolean('set-permissions') ?? false

            settings.roles[functionality as keyof IRoleSettings] = role.id

            await settings.save()

            if (setPerms) {
                if (functionality == 'moderator')
                    role.setPermissions(MODERATOR)
                else if (functionality == 'administrator')
                    role.setPermissions(ADMINISTRATOR)
            }

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Channel Set!').setColor('Yellow')
                        .setDescription(`${role} will now be identified as \`${functionality}\``)
                        .setFooter({ text: `Administrator: ${user.tag}` })
                ]
            })

            break
        }
    }
})