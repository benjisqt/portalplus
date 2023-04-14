const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Show a cute dog!')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent');
        
        const img = await fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json());

        if(silent === true) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Bark!`)
                    .setImage(`${img.message}`)
                    .setColor('Random')
                ], ephemeral: true
            })
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Bark!`)
                    .setImage(`${img.message}`)
                    .setColor('Random')
                ]
            })
        }
    }
}