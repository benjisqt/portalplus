const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const urban = require('relevant-urban');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('urban')
    .setDescription('Search for a definition from the Urban Dictionary')
    .addStringOption((opt) =>
        opt.setName('query')
        .setDescription('The query to search')
        .setRequired(true)
    )
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const silent = interaction.options.getBoolean('silent') || false;

        try {
            const data = await urban(query);

            if(silent === true) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Urban Definition: ${data.word}`)
                        .setDescription(`\`\`\`Definition: ${data.definition}\n\nExample: ${data.example}\`\`\``)
                        .setColor('Random')
                    ], ephemeral: true
                })
            } else {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Urban Definition: ${data.word}`)
                        .setDescription(`\`\`\`Definition: ${data.definition}\n\nExample: ${data.example}\`\`\``)
                        .setColor('Random')
                    ]
                })
            }
        } catch (err) {
            return Reply(interaction, 'Red', '🚫', 'No definition was found for that.', true);
        }
    }
}