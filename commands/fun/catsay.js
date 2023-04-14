const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('catsay')
    .setDescription('Make the cat say something of your choice!')
    .addStringOption((option) => option.setName('text').setDescription('The text!').setRequired(true)),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const msg = interaction.options.getString('text');

        return interaction.reply({
            files: [
                {
                    attachment: `https://cataas.com/cat/cute/says/${msg}`,
                    name: "catsay.gif",
                }
            ]
        })
    }
}