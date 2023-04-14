const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    vip: true,
    category: 'VIP',
    data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('VIP testing'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        return interaction.reply({ content: `Welcome to the VIP club!` });
    }
}