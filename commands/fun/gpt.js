const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: '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'
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('gpt')
    .setDescription('Chat GPT system!')
    .addSubcommand((sub) =>
        sub.setName('ask')
        .setDescription('Ask Chat GPT something!')
        .addStringOption((opt) =>
            opt.setName('prompt')
            .setDescription('The prompt to ask GPT!')
            .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    )
    .addSubcommand((sub) =>
        sub.setName('img')
        .setDescription('Chat GPT image generation!')
        .addStringOption((opt) =>
            opt.setName('prompt')
            .setDescription('The prompt you want to turn into an image!')
            .setRequired(true)
        )
        .addBooleanOption((opt) =>
            opt.setName('silent')
            .setDescription('Whether command feedback should only be sent to you')
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        await interaction.deferReply();

        const sub = interaction.options.getSubcommand();
        const prompt = interaction.options.getString('prompt');
        const silent = interaction.options.getBoolean('silent') || false;

        let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];

        conversationLog.push({
            role: 'user',
            content: prompt
        });

        switch(sub) {
            case 'ask': {
                const response = await openai.createChatCompletion({
                    model: 'gpt-4',
                    messages: conversationLog
                });

                if(silent === true) {
                    return interaction.reply({ content: `${response.data.choices[0].message}`, ephemeral: true });
                } else {
                    return interaction.reply({ content: `${response.data.choices[0].message}`});
                }
            }
            break;

            case 'img': {
                const response = await openai.createImage({
                    prompt: `${prompt}`,
                    n: 1,
                    size: `1024x1024`
                });

                const image = response.data.data[0].url;

                const embed = new EmbedBuilder()
                .setColor('Gold')
                .setImage(image)
                .setTitle(`Here's your image of a "${prompt}"`)
                .setTimestamp()
                .setFooter({ text: `Portal+ Image Generator - Powered by OpenAI GPT-4` })

                if(silent === true) {
                    return interaction.reply({ embeds: [embed] });
                } else {
                    return interaction.reply({ embeds: [embed] });
                }
            }
            break;
        }
    }
}