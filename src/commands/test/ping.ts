import { Command } from "../../Structures/Command";

// silly little test command. :)
export default new Command({
    name: 'ping', category: 'test',
    description: 'Replies with \'Pong!\'',
}, async (client, interaction) => {
    await interaction.reply({ content: 'Pong!' })
})