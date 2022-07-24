import {
    ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle,
    ChannelType, EmbedBuilder, PermissionFlagsBits, PermissionOverwriteOptions,
    PermissionResolvable, SelectMenuBuilder, SelectMenuComponentOptionData, TextChannel,
    ComponentType
} from 'discord.js'
import GuildSettingsModel, { GuildChannelSettings, GuildRoleSettings } from '../../Models/GuildSettingsModel'
import { Command } from '../../Structures/Command'
import { ADMINISTRATOR, MODERATOR } from '../../Util/Common'

const CHANNEL_MAP: Record<number, keyof GuildChannelSettings> = {
    0: 'activityLogs',
    1: 'moderationLogs',
    2: 'botSpam'
}
const CHANNEL_PERMISSIONS_MAP: Record<keyof GuildChannelSettings, PermissionOverwriteOptions> = {
    'activityLogs': { SendMessages: false },
    'moderationLogs': { SendMessages: false },
    'botSpam': { UseApplicationCommands: true },
}
const ROLE_MAP: Record<number, keyof GuildRoleSettings> = {
    0: 'moderator',
    1: 'administrator'
}
const ROLE_PERMISSIONS_MAP: Record<keyof GuildRoleSettings, PermissionResolvable> = {
    'moderator': MODERATOR,
    'administrator': ADMINISTRATOR
}

export default new Command({
    name: 'settings', category: 'system',
    description: 'Configuration for server settings.',
    permissions: ADMINISTRATOR,
    options: [
        {
            type: ApplicationCommandOptionType.SubcommandGroup,
            name: 'set', description: 'Sets a server setting to the provided value.',
            options: [
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'channel', description: 'Assigns functionality to a channel.',
                    options: [
                        {
                            type: ApplicationCommandOptionType.Channel,
                            name: 'channel', description: 'The channel to assign functionality to.',
                            required: true, channel_types: [ChannelType.GuildText]
                        },
                        {
                            type: ApplicationCommandOptionType.Integer,
                            name: 'functionality', description: 'The functionality to assign.',
                            required: true, choices: [
                                { name: 'Activity Logs', value: 0 },
                                { name: 'Moderation Logs', value: 1 },
                                { name: 'Bot Spam', value: 2 }
                            ]
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: 'set_permissions', description: 'Whether or not to set the necessary permissions for the channel. Ignores if left unspecified.'
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'role', description: 'Assigns functionality to a channel.',
                    options: [
                        {
                            type: ApplicationCommandOptionType.Role,
                            name: 'role', description: 'The role to assign functionality to.',
                            required: true
                        },
                        {
                            type: ApplicationCommandOptionType.Integer,
                            name: 'functionality', description: 'The functionality to assign.',
                            required: true, choices: [
                                { name: 'Moderator', value: 0 },
                                { name: 'Administrator', value: 1 }
                            ]
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: 'set_permissions', description: 'Whether or not to set the necessary permissions for the role. Ignores if left unspecified.'
                        }
                    ]
                },
                {
                    type: ApplicationCommandOptionType.Subcommand,
                    name: 'command', description: 'Enables/disables a command for this server.',
                    options: [
                        {
                            type: ApplicationCommandOptionType.String,
                            name: 'command_name', description: 'The command to configure.',
                            required: true
                        },
                        {
                            type: ApplicationCommandOptionType.Boolean,
                            name: 'enabled', description: 'Whether or not the command should be enabled.',
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: 'setup', description: 'Guides you through prompt through setting up the roles and channels for moderation.'
        }
    ]
}, async (client, interaction) => {
    let { guild, user, options } = interaction

    let group = options.getSubcommandGroup()
    let subcommand = options.getSubcommand()

    switch (`${group ?? 'N'}:${subcommand}`) {
        case 'set:channel': {
            let functionality = options.getInteger('functionality', true)
            let channel = options.getChannel('channel', true) as TextChannel
            let setPerms = options.getBoolean('set_permissions')

            let key = CHANNEL_MAP[functionality]

            if (setPerms) {
                let me = await guild.members.fetchMe()

                if (!me.permissions.has(PermissionFlagsBits.ManageChannels))
                    return await interaction.reply({ content: 'I do not have permission to manage channels.', ephemeral: true })

                await channel.permissionOverwrites.edit(guild.roles.everyone, CHANNEL_PERMISSIONS_MAP[key])
            }

            await GuildSettingsModel.setChannelFunctionality(guild.id, key, channel.id)

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Channel Set!').setColor('Yellow')
                        .setDescription(`${channel} will now be used as \`${key}\`.`)
                        .setFooter({ text: `Administrator: ${user.tag}` })
                ]
            })
        }
        case 'set:role': {
            let functionality = options.getInteger('functionality', true)
            let role = options.getRole('role', true)
            let setPerms = options.getBoolean('set_permissions')

            let key = ROLE_MAP[functionality]

            await GuildSettingsModel.setRoleFunctionality(guild.id, key, role.id)

            if (setPerms) {
                let me = await guild.members.fetchMe()

                if (me.roles.highest.position <= role.position)
                    return await interaction.reply({ content: 'I cannot modify roles with a higher position than mine.', ephemeral: true })
                if (!me.permissions.has(PermissionFlagsBits.ManageRoles))
                    return await interaction.reply({ content: 'I do not have permission to manage roles.', ephemeral: true })

                role.setPermissions(ROLE_PERMISSIONS_MAP[key])
            }

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Role Set!').setColor('Yellow')
                        .setDescription(`${role} will now be used as \`${key}\`.`)
                        .setFooter({ text: `Administrator: ${user.tag}` })
                ]
            })
        }
        case 'set:command': {
            let commandName = options.getString('command_name', true)
            let enabled = options.getBoolean('enabled', true)

            if (!client.commandHandler.commands.has(commandName))
                return await interaction.reply({ content: `Unknown command: \`${commandName}\`.`, ephemeral: true })

            await GuildSettingsModel.setCommandEnabled(guild.id, commandName, enabled)

            return await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Command Set!').setColor('Yellow')
                        .setDescription(`\`${commandName}\` is now ${enabled ? 'enabled' : 'disabled'}.`)
                        .setFooter({ text: `Administrator: ${user.tag}` })
                ]
            })
        }
    }
})

async function executeChannel(): Promise<void> {

}