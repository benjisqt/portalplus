const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { getAnimeGif } = require('anime-gifs-api');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('slap')
    .setDescription('Slap a member of the server!')
    .addUserOption((opt) =>
        opt.setName('member')
        .setDescription('The member you want to slap')
        .setRequired(true)
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const member = interaction.options.getMember('member');
        if(member.id === interaction.member.id) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`Why?!`)
                    .setDescription('Why you tryna slap yourself for?! ;(')
                    .setColor('Red')
                ]
            })
        };

        const {
            url: sfwGifUrl
        } = await getAnimeGif('Slap');

        let title;
        
        if(member.id !== interaction.guild.members.me.id) title = `${interaction.user.username} slaps ${member.user.username}!`
        if(member.id === interaction.guild.members.me.id) title = `${interaction.user.username} slaps ${interaction.guild.members.me.user.username}! Hey! :(`

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(title)
                .setImage(sfwGifUrl)
                .setColor('Random')
                .setFooter({ text: `Command requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            ]
        })
    }
}