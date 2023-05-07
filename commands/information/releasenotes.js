const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const commit = require('git-commit-count');
const git = require('simple-git').default();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('releasenotes')
    .setDescription('The release notes for Portal+ newest version!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        commit();
        const count = commit('benjisqt/portalplus');
        const cont = count / 10;
        const commitcount = `1.${cont}`
        const check = await git.log({ maxCount: 1 })

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`Newest Update (${commitcount}) release notes!`)
                .setDescription(`${check.latest.message}`)
                .setColor('Gold')
                .setThumbnail(interaction.guild.members.me.displayAvatarURL({ size: 1024 }))
            ]
        });
    }
}