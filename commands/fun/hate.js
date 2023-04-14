const {
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('hate')
        .setDescription('Check your hate rate with someone >:(')
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

        const percentage = Math.floor(Math.random() * 100) + 1;

        if(silent === true) {
            return Reply(interaction, 'Red', '🤬', `${interaction.user.username} hates ${member.user.username} ${percentage}%!`, true);
        } else {
            return Reply(interaction, 'Red', '🤬', `${interaction.user.username} hates ${member.user.username} ${percentage}%!`, false);
        }
    }
}