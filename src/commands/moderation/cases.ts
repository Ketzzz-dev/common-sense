import { APIEmbedField, Formatters, PermissionFlagsBits } from 'discord.js'
import GuildCasesModel from '../../Models/GuildCasesModel'
import SlashCommand from '../../Structures/SlashCommand'
import { SubcommandOption, UserOption } from '../../Structures/SlashCommandOptions'
import Embed from '../../Util/Embed'

export default new SlashCommand({
    name: 'cases', category: 'moderation',
    description: 'Views the cases for {user}.',
    memberPerms: PermissionFlagsBits.ModerateMembers,
    options: [
        new SubcommandOption('user', 'Views a user\'s cases.', [
            new UserOption('user', 'The user to view cases from.', { required: true })
        ]),
        new SubcommandOption('moderator', 'Views a moderator\'s cases.', [
            new UserOption('moderator', 'The moderator to view cases from.', { required: true })
        ])
    ]
}, async (client, interaction) => {
    let { guild, options, member } = interaction

    let guildCases = await GuildCasesModel.get(guild.id)

    switch (options.getSubcommand()) {
        case 'user': {
            let user = options.getUser('user', true)
            let cases = guildCases.getUserCases(user.id)

            if (!cases.length)
                return await interaction.reply({
                    embeds: [Embed.warning('This user does not have any cases.')],
                    ephemeral: true
                })

            let fields = await Promise.all(cases.slice(-25)
                .map<Promise<APIEmbedField>>(async c => {
                    let moderator = await guild.members.fetch(c.moderatorId)

                    return {
                        name: `Case #${c.id}: ${c.type}`,
                        value: [
                            `Reason: ${c.reason}`,
                            `\u200B`,
                            `Moderator: ${moderator}`,
                            `At: ${Formatters.time(c.timestamp, 'F')}, (${Formatters.time(c.timestamp, 'R')})`
                        ].join('\n')
                    }
                }))
            

            await interaction.reply({ 
                embeds: [Embed.default(
                    'User cases', `${user} has a total of ${cases.length} cases logged`,
                    member.user, ...fields
                    )]
            })

            break
        }
        case 'moderator': {
            let moderator = options.getUser('moderator', true)
            let cases = guildCases.getModeratorCases(moderator.id)

            if (!cases.length)
                return await interaction.reply({
                    embeds: [Embed.warning('This user does not have any cases.')],
                    ephemeral: true
                })

            let fields = await Promise.all(cases.slice(-25)
                .map<Promise<APIEmbedField>>(async c => {
                    let user = await guild.members.fetch(c.userId)

                    return {
                        name: `Case #${c.id}: ${c.type}`,
                        value: [
                            `Reason: ${c.reason}`,
                            `\u200B`,
                            `User: ${user}`,
                            `At: ${Formatters.time(c.timestamp, 'F')}, (${Formatters.time(c.timestamp, 'R')})`
                        ].join('\n')
                    }
                }))

            await interaction.reply({ 
                embeds: [Embed.default(
                    'Moderator cases', `${moderator} has a total of ${cases.length} cases logged`,
                    member.user, ...fields
                    )]
            })
    
            break
        }
    }
})