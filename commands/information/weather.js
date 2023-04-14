const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { EditReply } = require('../../util/replies');
const weather = require('weather-js');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Weather command!')
    .addStringOption((opt) =>
        opt.setName('location')
        .setDescription('The location you want to see (e.g. London, UK)')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const location = interaction.options.getString('location');
        const emoji = client.emojis.cache.get('1086087120143261816');   
        const msg = await interaction.reply({ content: `Gathering weather data... ${emoji}` });

        await weather.find({ search: `${location}`, degreeType: 'C' }, async function(err, result) {
            if(err) {
                console.log(err);
                return msg.edit({ embeds: [
                    new EmbedBuilder()
                    .setTitle(`Error! 🚫`)
                    .setDescription(`There was an error finding that location.`)
                    .setColor('Red')
                ] })
            } else {
                const temp = result[0].current.temperature;
                const type = result[0].current.skytext;
                const name = result[0].location.name;
                const feel = result[0].current.feelslike;
                const icon = result[0].current.imageUrl;
                const wind = result[0].current.winddisplay;
                const day = result[0].current.day;
                const alert = result[0].location.alert || "None";

                return msg.edit({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Weather Information: ${name}`)
                        .addFields(
                            { name: 'Temperature', value: `${temp}°C` },
                            { name: 'Feels Like', value: `${feel}°C` },
                            { name: 'Weather', value: `${type}` },
                            { name: 'Current Alerts', value: `${alert}` },
                            { name: 'Week Day', value: `${day}` },
                            { name: 'Wind Speed & Direction', value: `${wind}` },
                        )
                        .setThumbnail(icon)
                        .setColor('Random')
                    ], content: ``
                })
            }
        })
    }
}