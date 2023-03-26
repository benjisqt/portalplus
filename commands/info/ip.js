const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { Reply } = require('../../util/replies');

module.exports = {
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
        const ip = interaction.options.getString('ip');

        await fetch(`http://ip-api.com/json/${ip}`).then(res => res.json()).then(res => {
            if(res.success === 'fail') return interaction.channel.send(interaction, 'Red', '🚫', `There was an error finding information for that IP address.\nTry making sure you entered it correctly.`, true);

            if(res.success === 'success') {
                return interaction.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`IP information for ${ip}`)
                        .setDescription(`\`\`\`Country: ${res.country}\nCountry Code: ${res.countryCode}\nRegion: ${res.regionName}\nCity: ${res.city}\nZip/Post Code: ${res.zip}\nTime Zone: ${res.timezone}\nISP: ${res.isp}\nOrganisation: ${res.org}\`\`\``)
                    ]
                })
            }
        })
    }
}