const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('pregnont')
    .setDescription('Pregnont'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const personpreg = interaction.guild.members.cache.random();
        const father = interaction.guild.members.cache.filter((m) => m.user.id !== personpreg.id).random();

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Pregnont Predictor!`)
                .addFields(
                    { name: 'Person Pregnant', value: `Calculating...` },
                    { name: 'Father', value: `Calculating...` }
                )
                .setColor('Gold')
                .setFooter({ text: `Portal+ Pregnoncy Calculator` })
            ]
        });

        setTimeout(() => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Pregnont Predictor!`)
                        .addFields(
                            { name: 'Person Pregnant', value: `<@${personpreg.id}>` },
                            { name: 'Father', value: `Calculating...` }
                        )
                        .setColor('Gold')
                        .setFooter({ text: `Portal+ Pregnoncy Calculator` })
                ]
            });
        }, 2000)

        setTimeout(() => {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Pregnont Predictor!`)
                    .addFields(
                        { name: 'Person Pregnant', value: `<@${personpreg.id}>` },
                        { name: 'Father', value: `<@${father.id}>` }
                    )
                    .setColor('Gold')
                    .setFooter({ text: `Portal+ Pregnoncy Calculator` })
                ]
            })
        }, 4000)
    }
}