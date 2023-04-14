const { SlashCommandBuilder, ChatInputCommandInteraction } = require('discord.js');
const { Reply } = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
    .setName('pp')
    .setDescription('Check people\'s PP size')
    .addUserOption((option) =>
    option
        .setName('member')
        .setDescription('The user you want to check')
        .setRequired(true)
    )
    .addBooleanOption((opt) =>
        opt.setName('silent')
        .setDescription('Whether command feedback should only be sent to you')
    ),

    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('member') || interaction.user;
        const silent = interaction.options.getBoolean('silent') || false;

        const pp = Math.floor(Math.random() * 16) + 1;

        let emoji;

        if(pp >= 5) emoji = '😏'
        if(pp <= 5) emoji = '😣'

        let length;

        if(pp === 1) length = '8=>';
        if(pp === 2) length = '8==>';
        if(pp === 3) length = '8===>';
        if(pp === 4) length = '8====>';
        if(pp === 5) length = '8=====>';
        if(pp === 6) length = '8======>';
        if(pp === 7) length = '8=======>';
        if(pp === 8) length = '8========>';
        if(pp === 9) length = '8=========>';
        if(pp === 10) length = '8==========>';
        if(pp === 11) length = '8===========>';
        if(pp === 12) length = '8============>';
        if(pp === 13) length = '8=============>';
        if(pp === 14) length = '8==============>';
        if(pp === 15) length = '8===============>';
        if(pp === 16) length = '8================>';

        if(silent === true) {
            return Reply(interaction, 'Random', '🍆', `${user.username}'s: **${length}** (${pp} inches) ${emoji}`, true);
        } else {
            return Reply(interaction, 'Random', '🍆', `${user.username}'s: **${length}** (${pp} inches) ${emoji}`, false);
        }
    }
}