const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('boosters')
    .setDescription('See all guild boosters')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should be sent publicly.')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent') || false;
        const boostmembers = interaction.guild.members.cache.filter(m => m.premiumSince)
        if(silent === true) {
            if(boostmembers.size === 0) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🚫 | This guild doesn't appear to have any boosters...`)
                    .setColor('Red')
                ], ephemeral: true
            })

            const allmembers = boostmembers.map(m => {
                return `${m.user.tag}`
            }).join('\n');
    
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`There are currently ${boostmembers.size} boosting:\n\n${allmembers}`)
                ], ephemeral: true
            })
        } else {
            if(boostmembers.size === 0) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`🚫 | This guild doesn't appear to have any boosters...`)
                    .setColor('Red')
                ]
            })

            const allmembers = boostmembers.map(m => {
                return `${m.user.tag}`
            }).join('\n');
    
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setDescription(`There are currently ${boostmembers.size} boosting:\n\n${allmembers}`)
                ]
            })
        }
    }
}