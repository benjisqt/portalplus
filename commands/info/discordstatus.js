const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('discordstatus')
    .setDescription('Discord API Status')
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const silent = interaction.options.getBoolean('silent');
        const data = await fetch('https://discordstatus.com/api/v2/summary.json').then(res => res.json());

        if(silent === true) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Discord API Status`)
                    .setColor('Random')
                    .addFields(
                        {
                            name: `${data.components[0].name} Status`,
                            value: `\`${data.components[0].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[1].name} Status`,
                            value: `\`${data.components[1].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[4].name} Status`,
                            value: `\`${data.components[4].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[5].name} Status`,
                            value: `\`${data.components[5].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[7].name} Status`,
                            value: `\`${data.components[7].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[8].name} Status`,
                            value: `\`${data.components[8].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[10].name} Status`,
                            value: `\`${data.components[10].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[11].name} Status`,
                            value: `\`${data.components[11].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[14].name} Status`,
                            value: `\`${data.components[14].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[16].name} Status`,
                            value: `\`${data.components[16].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[18].name} Status`,
                            value: `\`${data.components[18].status}\``,
                            inline: true
                        },
                    )
                ], ephemeral: true
            })
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Discord API Status`)
                    .setColor('Random')
                    .addFields(
                        {
                            name: `${data.components[0].name} Status`,
                            value: `\`${data.components[0].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[1].name} Status`,
                            value: `\`${data.components[1].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[4].name} Status`,
                            value: `\`${data.components[4].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[5].name} Status`,
                            value: `\`${data.components[5].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[7].name} Status`,
                            value: `\`${data.components[7].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[8].name} Status`,
                            value: `\`${data.components[8].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[10].name} Status`,
                            value: `\`${data.components[10].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[11].name} Status`,
                            value: `\`${data.components[11].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[14].name} Status`,
                            value: `\`${data.components[14].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[16].name} Status`,
                            value: `\`${data.components[16].status}\``,
                            inline: true
                        },
                        {
                            name: `${data.components[18].name} Status`,
                            value: `\`${data.components[18].status}\``,
                            inline: true
                        },
                    )
                ]
            })
        }
    }
}