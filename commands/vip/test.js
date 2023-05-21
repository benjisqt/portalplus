const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');

module.exports = {
    vip: true,
    category: 'VIP',
    data: new SlashCommandBuilder()
    .setName('test')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDescription('VIP testing'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        return interaction.reply({ content: `Welcome to the VIP club!` });
    }
}