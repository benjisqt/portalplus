const { SlashCommandBuilder, ChatInputCommandInteraction, Client, StringSelectMenuBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        let categories = [];

        client.commands.forEach((cmd) => {
            if (!cmd.category) return;
            if (categories.includes(cmd.category)) return;

            categories.push(cmd.category);
        });

        const emojis = require('../../util/emojis.json').handler.directories.emojis;

        let components = [
            new StringSelectMenuBuilder()
                .setCustomId('select_menu')
                .setPlaceholder('Select a category here')
                .addOptions(
                    categories.map((cat) => {
                        return {
                            label: cat,
                            value: cat,
                            emoji: emojis[cat] || '👁️'
                        }
                    })
                )
        ];

        let msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Help Menu')
                    .setDescription('Please select a category from the select menu below.')
                    .setColor('Blurple')
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        components[0]
                    )
            ],
            fetchReply: true
        });

        const collector = interaction.channel.createMessageComponentCollector({
            filter: (int) => int.user.id === interaction.user.id,
            time: 30000,
        });

        collector.on('collect', async (i) => {
            return i.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Category: ` + i.values[0])
                        .addFields(
                            client.commands.filter((cmd) => cmd.category === i.values[0])
                                .map((cmd) => {
                                    return {
                                        name: `- \`/${cmd.data.name}\``,
                                        value: `> ${cmd.data.description || "No Description."}`,
                                        inline: true
                                    }
                                })
                        )
                        .setColor('Blurple')
                ],
                ephemeral: true
            })
        });

        collector.on('end', async () => {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`Help Menu Expired`)
                        .setDescription(`Your help menu has expired after 30 seconds, please try running the command again.`)
                        .setColor('Red')
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            components[0].setDisabled(true)
                        )
                ]
            });
        });
    }
}