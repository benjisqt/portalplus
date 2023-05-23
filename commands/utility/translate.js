const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client } = require('discord.js');
const translate = require('@iamtraction/google-translate');

module.exports = {
    category: 'Utility',
    data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('Translate words and phrases!!')
    .addStringOption((opt) =>
        opt.setName('message')
        .setDescription('The message you want to translate')
        .setRequired(true)
    )
    .addStringOption((opt) =>
        opt.setName('language')
        .setDescription('The language you want to translate to')
        .setRequired(true)
        .addChoices(
            { name: 'English', value: 'en' },
            { name: 'Latin', value: 'la' },
            { name: 'French', value: 'fr' },
            { name: 'German', value: 'de' },
            { name: 'Italian', value: 'it' },
            { name: 'Portuguese', value: 'pt' },
            { name: 'Spanish', value: 'es' },
            { name: 'Greek', value: 'gl' },
            { name: 'Russian', value: 'ru' },
            { name: 'Japanese', value: 'ja' },
            { name: 'Arabic', value: 'ar' },
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const message = interaction.options.getString('message');
        const lang = interaction.options.getString('language');
        const emoji = client.emojis.cache.get('1096078204680286329');
        const translateemoji = client.emojis.cache.get('1109893077574877205');

        interaction.reply({ content: `${translateemoji}${emoji} Translating...` });

        const applied = await translate(message, { to: `${lang}` }).catch(err => {
            console.log(err);
            return interaction.editReply({ content: `🛑 An error appears to have occured...` });
        });

        return interaction.editReply({
            content: ``,
            embeds: [
                new EmbedBuilder()
                .setTitle(`${translateemoji} Translation Successful`)
                .addFields(
                    { name: 'Original Message', value: `\`\`\`${message}\`\`\`` },
                    { name: 'Translated Message', value: `\`\`\`${applied.text}\`\`\`` }
                )
                .setColor('Gold')
            ]
        })
    }
}