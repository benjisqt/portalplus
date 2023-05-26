const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest something to add to the bot!')
    .addStringOption((opt) =>
        opt.setName('suggestion')
        .setDescription('The thing you want to suggest!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const suggestion = interaction.options.getString('suggestion');
        const ch = client.guilds.cache.get('1067969426684649512').channels.cache.get('1111785869460906006');

        ch.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Incoming suggestion from ${interaction.user.tag}`)
                .setDescription(`> A suggestion has been submitted by ${interaction.user.tag} in \`${interaction.guild.name}\`.`)
                .addFields(
                    { name: 'Suggestion', value: `${suggestion}` }
                )
                .setColor('Gold')
            ]
        });

        return interaction.reply({
            content: `Thanks for your suggestion! It has been sent to the owner.`,
            ephemeral: true
        });
    }
}