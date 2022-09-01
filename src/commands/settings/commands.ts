import { ChannelType, PermissionFlagsBits, PermissionsBitField } from 'discord.js'
import SlashCommand from '../../Structures/SlashCommand'
import { ChannelOption, StringOption, SubcommandOption } from '../../Structures/SlashCommandOptions'
import Embeds from '../../Util/Embeds'

export default new SlashCommand({
    name: 'commands', category: 'settings',
    description: 'Configures the commands\' behaviour in this server.',
    memberPerms: [PermissionFlagsBits.ManageGuild],
    botPerms: [PermissionFlagsBits.ManageGuild],
    options: [
        new SubcommandOption('channel', 'Sets the given channel for command spam.', [
            new ChannelOption('channel', 'The channel to set for command spam, sets to none if left unspecified.', {
                channelTypes: [ChannelType.GuildText]
            })
        ]),
        new SubcommandOption('disable', 'Disables the given command for this server.', [
            new StringOption('command_name', 'The name of the command to disable, enables if it\'s already disabled.', {
                required: true, autocomplete: true
            })
        ])
    ]
}, async (client, interaction) => {
    let { options, guild } = interaction

    switch (options.getSubcommand()) {
        case 'channel': {
            let channel = options.getChannel('channel')

            guild.channels.cache.forEach((c) => {
                if (c.type == ChannelType.GuildText) c.permissionOverwrites.edit(guild.roles.everyone, {
                    UseApplicationCommands: channel ? c.id == channel.id : true
                })
            })

            return await interaction.reply({
                embeds: [Embeds.info(`${channel} is now set for command spam.`)]
            })
        }
        case 'disable': {
            
        }
    }
})
