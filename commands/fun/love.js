const {
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('Check your love rate with someone <3')
        .addUserOption((opt) =>
            opt.setName('member')
            .setDescription('The user to check.')
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
        const member = interaction.options.getMember('member');
        const silent = interaction.options.getBoolean('silent') || false;

        if(member.id === interaction.member.id) {
            if(silent === true) {
                return Reply(interaction, 'Red', '❤️', `${interaction.user.username} loves themself 100%! :)`, true);
            } else {
                return Reply(interaction, 'Red', '❤️', `${interaction.user.username} loves themself 100%! :)`, false);
            }
        }

        const percentage = Math.floor(Math.random() * 100) + 20;

        if(silent === true) {
            return Reply(interaction, 'Red', '❤️', `${interaction.user.username} ❤️${percentage}%❤️ ${member.user.username}`, true);
        } else {
            return Reply(interaction, 'Red', '❤️', `${interaction.user.username} ❤️${percentage}%❤️ ${member.user.username}`, false);
        }
    }
}