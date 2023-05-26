const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Has something gone wrong? Report it!')
    .addStringOption((opt) =>
        opt.setName('bug')
        .setDescription('The bug you have encountered!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const bug = interaction.options.getString('bug');
        const ch = client.guilds.cache.get('1067969426684649512').channels.cache.get('1111786622296526981');

        ch.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Incoming bug report from ${interaction.user.tag}`)
                .setDescription(`> A bug report has been submitted by ${interaction.user.tag} in \`${interaction.guild.name}\`.`)
                .addFields(
                    { name: 'Bug', value: `${bug}` }
                )
                .setColor('Gold')
            ]
        });

        return interaction.reply({
            content: `Thanks for your bug report! It has been sent to the owner.`,
            ephemeral: true
        });
    }
}