const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const poll = require('../../models/poll');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Start a poll!')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((opt) => opt.setName('topic').setDescription('The topic of the poll!').setRequired(true).setMinLength(1).setMaxLength(2000)),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const topic = interaction.options.getString('topic');
        const emoji = client.emojis.cache.get('1109898459324096533');

        const embed = new EmbedBuilder()
        .setAuthor({ name: 'Poll Started', iconURL: `${emoji.url}` })
        .setTimestamp()
        .setDescription(`${interaction.user}: ${topic}`)
        .addFields(
            { name: 'Upvotes', value: `> **No Votes**`, inline: true },
            { name: 'Downvotes', value: `> **No Votes**`, inline: true },
            { name: 'Author', value: `${interaction.user}`, inline: true },
        )
        .setColor('Gold')

        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('up')
            .setLabel('✅')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('down')
            .setLabel('❌')
            .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
            .setCustomId('votes')
            .setLabel('Votes')
            .setStyle(ButtonStyle.Secondary)
        )

        const msg = await interaction.channel.send({ embeds: [embed], components: [buttons] });

        await msg.createMessageComponentCollector();

        await poll.create({
            Guild: interaction.guildId,
            DownvoteMembers: [],
            UpvoteMembers: [],
            Downvotes: 0,
            Upvotes: 0,
            Message: msg.id,
            Owner: `${interaction.user.id}`,
            Topic: topic
        });
    }
}