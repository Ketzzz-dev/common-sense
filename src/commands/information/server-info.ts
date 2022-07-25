// import { ChannelType, EmbedBuilder, Formatters, GuildPremiumTier } from 'discord.js'
// import { Command } from '../../Structures/Command'

// export default new Command({
//     name: 'server-info', category: 'information',
//     description: 'Provides an embed of `user`\'s or your information.'
// }, async (client, interaction) => {
//     let { guild, user } = interaction

//     let owner = await guild.fetchOwner()

//     let members = guild.members.cache
//     let channels = guild.channels.cache
//     let emojis = guild.emojis.cache

//     let roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(r => r.toString())

//     await interaction.reply({
//         embeds: [
//             new EmbedBuilder()
//                 .setTitle(`**${guild.name}** information`).setColor('Green')
//                 .setThumbnail(guild.iconURL({ extension: 'png', size: 1024 }))
//                 .setDescription([
//                     `**Owner**: ${owner}, **ID**: ${guild.id}`,
//                     `**Boosts**: ${guild.premiumSubscriptionCount}, **Teir**: ${guild.premiumTier != GuildPremiumTier.None ? `Tier ${guild.premiumTier}` : 'None'}`,
//                     '\u200B',
//                     `**Created**: ${Formatters.time(guild.createdAt, 'F')} ${Formatters.time(guild.createdAt, 'R')}`
//                 ].join('\n'))
//                 .addFields(
//                     {
//                         name: 'Members',
//                         value: [
//                             `**Humans**: ${members.filter(m => !m.user.bot).size}, **Bots**: ${members.filter(m => m.user.bot).size}`,
//                             '\u200B',
//                             `**Total**: ${members.size}`
//                         ].join('\n'),
//                         inline: true
//                     },
//                     {
//                         name: 'Channels',
//                         value: [
//                             `**Text**: ${channels.filter(c => c.type == ChannelType.GuildText).size}, **Voice**: ${channels.filter(c => c.type == ChannelType.GuildVoice).size}`,
//                             `**News**: ${channels.filter(c => c.type == ChannelType.GuildNews).size}, **Stage**: ${channels.filter(c => c.type == ChannelType.GuildStageVoice).size}`,
//                             '\u200B',
//                             `**Total**: ${channels.size}`
//                         ].join('\n'),
//                         inline: true
//                     },
//                     {
//                         name: 'Emojis',
//                         value: [
//                             `**Normal**: ${emojis.filter(e => !e.animated).size}, **Animated**: ${emojis.filter(e => !!e.animated).size}`,
//                             '\u200B',
//                             `**Total**: ${emojis.size}`
//                         ].join('\n'),
//                         inline: true
//                     },
//                     {
//                         name: 'Roles',
//                         value: [
//                             roles.length ? roles.join(', ') : 'None',
//                             '\u200B',
//                             `**Total**: ${roles.length}`
//                         ].join('\n')
//                     }
//                 )
//                 .setFooter({ text: `User: ${user.tag}` })
//         ]
//     })
// })  