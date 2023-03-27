const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require('discord.js');
const {
    getAnimeGif
} = require('anime-gifs-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cuddle')
        .setDescription('To cuddle with someone 🤗')
        .addUserOption((opt) =>
            opt.setName('member')
            .setDescription('User to cuddle.')
            .setRequired(true)
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const {
            url: sfwGifUrl
        } = await getAnimeGif('Cuddle');

        const member = interaction.options.getMember('member');

        if (member.id === interaction.member.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.guild.members.me.user.username} cuddles with ${interaction.user.username}!`)
                .setImage(sfwGifUrl)
                .setColor('Purple')
            ]
        })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.username} cuddles with ${member.user.username}`)
                .setImage(sfwGifUrl)
                .setColor('Purple')
            ]
        })
    }
}