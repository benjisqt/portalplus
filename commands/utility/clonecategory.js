const { SlashCommandBuilder, ChatInputCommandInteraction, ChannelType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clonecategory')
    .setDescription('Clone a category!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((opt) =>
        opt.setName('category')
        .setDescription('The category')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const ch = interaction.options.getChannel('category');
        ch.clone();
        const msg = await interaction.reply({
            content: `Successfully cloned ${ch}.`
        });

        setTimeout(() => {
            msg.delete();
        }, 2000);
    }
}