const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('reddit-fetch');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('food')
    .setDescription('Send a satisfying food image')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent') || false;

        await fetch({
            subreddit: 'foodporn',
            allowCrossPost: false,
            allowModPost: false,
            allowNSFW: false,
            allowVideo: false,
            sort: 'hot'
        }).then(post => {
            if(silent === true) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Mmm! 😋`)
                        .setImage(post.url)
                        .setColor('Random')
                        .setDescription(`Posted by u/${post.author}`)
                    ], ephemeral: true
                })
            } else {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Mmm! 😋`)
                        .setImage(post.url)
                        .setColor('Random')
                        .setDescription(`Posted by u/${post.author}`)
                    ], ephemeral: false
                })
            }  
        })
    }
}