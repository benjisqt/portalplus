const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin!')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const silent = interaction.options.getBoolean('silent') || false;

        const options = [
            'Heads!',
            'Tails!'
        ];

        const option = options[Math.floor(Math.random() * options.length)];

        const emoji = client.emojis.cache.get('1047204576249528430');

        if(silent === true) {
            const msg = await interaction.reply({ content: `Flipping... ${emoji}`, ephemeral: true });

            setTimeout(() => {
                msg.edit({ content: `Result: **${option}** ${emoji}` })
            }, 4000);

            setTimeout(() => {
                msg.delete();
            }, 8000)
        } else {
            const msg = await interaction.reply({ content: `Flipping... ${emoji}` });

            setTimeout(() => {
                msg.edit({ content: `Result: **${option}** ${emoji}` })
            }, 4000);

            setTimeout(() => {
                msg.delete();
            }, 8000);
        }
    }
}