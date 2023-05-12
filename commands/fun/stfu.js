const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stfu')
    .setDescription('Tell a user to stfu')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want to stfu')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        interaction.reply({
            content: `done`,
            ephemeral: true
        })

        return interaction.channel.send({
            content: `${user}, stfu.`
        });
    }
}