const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magestic 8ball!')
        .addStringOption((opt) =>
            opt.setName('query')
                .setDescription('What do you want to ask?')
                .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt.setName('silent')
                .setDescription('Whether command feedback should only be sent to you')
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const query = interaction.options.getString('query');
        const silent = interaction.options.getBoolean('silent');

        const emoji = client.emojis.cache.get('1096492676653797396');

        if (silent === true) {
            await interaction.reply({
                content: `${emoji} Predicting result...`,
                ephemeral: true
            })
        } else {
            await interaction.reply({
                content: `${emoji} Predicting result...`
            })
        }

        const results = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes, definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.'
        ];

        const result = results[Math.floor(Math.random() * results.length)];

        setTimeout(() => {
            return interaction.editReply({
                content: `\`🎱\` Result: ${result}\nQuestion: **${query}**`
            });
        }, 1250)
    }
}