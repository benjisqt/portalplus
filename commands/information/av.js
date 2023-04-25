const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Information',
    data: new SlashCommandBuilder()
    .setName('av')
    .setDescription('Get the avatar of a user!')
    .addUserOption((opt) =>
        opt.setName('user')
        .setDescription('The user you want the avatar of')
        .setRequired(true)
    )
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user');

        const member = interaction.guild.members.cache.get(user.id);
        if(!member) return Reply(interaction, 'Red', '❗️', 'That user was not found in this guild.', true);

        const silent = interaction.options.getBoolean('silent') || false;

        if(silent === true) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${user.tag}'s Avatar`)
                    .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .setColor('Random')
                ], ephemeral: true
            })
        } else {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setTitle(`${user.tag}'s Avatar`)
                    .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .setColor('Random')
                ]
            })
        }
    }
}