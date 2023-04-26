const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invis')
    .setDescription('See all users in the guild that are invisible!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const members = interaction.guild.members.cache.filter((m) => m.presence.status === 'invisible');

        if(members.size <= 0) return interaction.reply({ content: `No invis people in this server!`, ephemeral: true });

        let ar = [];

        members.forEach(member => {
            ar.push(member.user.tag)
        });

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setTitle(`All Invisible People In ${interaction.guild.name}`)
                .setDescription(ar.join('\n'))
                .setColor('Gold')
                .setFooter({ text: `Portal+` })
            ]
        });
    }
}