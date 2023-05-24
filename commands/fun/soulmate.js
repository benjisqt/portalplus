const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('soulmate')
    .setDescription('Soulmate finder! Find your soulmate!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const member = interaction.guild.members.cache.filter((mem) => !mem.user.bot).random();

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`❤️ Soulmate Finder! ❤️`)
                .setDescription(`> Your soulmate issss... <@${member.id}>`)
                .setColor('Red')
            ]
        })
    }
}