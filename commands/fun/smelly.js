const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('smelly')
    .setDescription('See how smelly someone is! Pee-yew!')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The potentially smelly user')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const rannum = Math.floor(Math.random() * 100) + 1;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`😷 | ${user} is ${rannum}% smelly!`)
            ]
        });
    }
}