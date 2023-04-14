const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    EmbedBuilder
} = require('discord.js');
const {
    getAnimeGif
} = require('anime-gifs-api');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('To hug someone 🤗')
        .addUserOption((opt) =>
            opt.setName('member')
            .setDescription('User to hug.')
            .setRequired(true)
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const {
            url: sfwGifUrl
        } = await getAnimeGif('Hug');

        const member = interaction.options.getMember('member');

        if (member.id === interaction.member.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.guild.members.me.user.username} hugs ${interaction.user.username}!`)
                .setImage(sfwGifUrl)
                .setColor('Purple')
            ]
        })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${interaction.user.username} hugs ${member.user.username}`)
                .setImage(sfwGifUrl)
                .setColor('Purple')
            ]
        })
    }
}