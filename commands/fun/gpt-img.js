const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const config = require('../../config.json');

const configuration = new Configuration({
    apiKey: config.openai,
});

const openai = new OpenAIApi(configuration);

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('gpt-img')
        .setDescription('Chat GPT image generation!')
        .addStringOption((opt) =>
            opt.setName('prompt')
                .setDescription('The prompt you want to turn into an image!')
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

    async execute(interaction, client) {
        const emoji = client.emojis.cache.get('1096078204680286329');
        const silent = interaction.options.getBoolean('silent') || false;

        if(silent === true) {
            await interaction.reply({ content: `${emoji} Generating GPT-4 image...`, ephemeral: true})
        } else {
            await interaction.reply({ content: `${emoji} Generating GPT-4 image...`})
        }

        const prompt = interaction.options.getString('prompt');

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

        return interaction.editReply({ content: ``, embeds: [embed] });
    }
}