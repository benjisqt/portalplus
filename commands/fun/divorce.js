const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const marry = require('../../models/marry');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('divorce')
    .setDescription('Divorce your love on the server!'),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const married = await marry.find({ Guild: interaction.guildId });

        married.map((marries) => {
            if(!marries.Users.includes(interaction.user.id)) return Reply(interaction, 'Red', '❗️', 'You aren\'t even married!', true);
        });

        interaction.reply({ content: `Divorced successfully!`, ephemeral: true });

        interaction.channel.send({
            content: `${interaction.user.username} would like to divorce 😭\nOh well.`
        });
        
        marry.findOne({ Users: { $all: [interaction.user.id] } }).then(c => c.deleteOne({ Users: { $all: [interaction.user.id] } }));
    }
}