const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Provides detailed information about an IP address')
    .addStringOption((opt) =>
        opt.setName('ip')
        .setDescription('The IPV4 address to search up')
        .setRequired(true)
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        await interaction.deferReply();
        const ip = interaction.options.getString('ip');

        await fetch(`http://ip-api.com/json/${ip}`).then(res => res.json()).then(res => {
            if(!res.country) return interaction.editReply(interaction, 'Red', '🚫', `There was an error finding information for that IP address.\nTry making sure you entered it correctly.`, true);

            if(res.country) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`IP information for ${ip}`)
                        .setDescription(`\`\`\`Country: ${res.country}\nCountry Code: ${res.countryCode}\nRegion: ${res.regionName}\nCity: ${res.city}\nZip/Post Code: ${res.zip}\nTime Zone: ${res.timezone}\nISP: ${res.isp}\nOrganisation: ${res.org}\`\`\``)
                        .setColor('Random')
                    ]
                })
            }
        })
    }
}