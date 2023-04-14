const {
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js');
const {
    Reply
} = require('../../util/replies');

module.exports = {
    category: 'Fun',
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('Rate commands')
        .addSubcommand((sub) =>
            sub.setName('gay')
            .setDescription('Gay rate of a user')
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to check!')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('smart')
            .setDescription('Smart rate of a user')
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to check!')
            )
        )
        .addSubcommand((sub) =>
            sub.setName('dumb')
            .setDescription('Dumb rate of a user')
            .addUserOption((opt) =>
                opt.setName('user')
                .setDescription('The user you want to check!')
            )
        ),
    
    /**
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const sub = interaction.options.getSubcommand();
        const percentage = Math.floor(Math.random() * 99) + 1;

        switch(sub) {
            case 'gay' : {
                return Reply(interaction, 'Blurple', '🏳️‍🌈', `${user} is ${percentage}% gay!`, false);
            }
            break;

            case 'smart' : {
                return Reply(interaction, 'Blurple', '🤓', `${user} is ${percentage}% smart!`, false);
            }
            break;
            
            case 'dumb' : {
                return Reply(interaction, 'Blurple', '🤪', `${user} is ${percentage}% dumb!`, false);
            }
            break;
        }
    }
}