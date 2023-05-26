const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('bugreport')
    .setDescription('Report a bug found in Portal+!')
    .addStringOption((opt) =>
        opt.setName('bug')
        .setDescription('The bug you want to report!')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const bug = interaction.options.getString('bug');
        const ch = interaction.options.getChannel('1111786622296526981');

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
    }
}