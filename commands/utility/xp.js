const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const xp = require('../../models/xp');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('xp')
    .setDescription('XP Management Commands')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addSubcommand((sub) =>
        sub.setName('add')
        .setDescription('Add XP to a user!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to add XP to!')
            .setRequired(true)
        )
        .addNumberOption((opt) =>
            opt.setName('xp')
            .setDescription('The amount of XP you want to add')
            .setRequired(true)
        )
    ).addSubcommand((sub) =>
        sub.setName('remove')
        .setDescription('Remove XP from a user!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to remove XP from!')
            .setRequired(true)
        )
        .addNumberOption((opt) =>
            opt.setName('xp')
            .setDescription('The amount of XP you want to remove')
            .setRequired(true)
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const number = interaction.options.getNumber('xp');
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'add': {
                const data = await xp.findOne({ Guild: interaction.guildId, User: user.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user does not have any XP.`, true);

                data.XP + number;

                data.save();

                return Reply(interaction, 'Green', '✅', `Successfully added ${number} XP to ${user}.`, false);
            }
            break;
            case 'remove': {
                const data = await xp.findOne({ Guild: interaction.guildId, User: user.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user does not have any XP.`, true);
                if(data.XP <= 0) return Reply(interaction, 'Red', '🛑', `That user does not have any XP.`, true);

                if(number > data.XP) return Reply(interaction, 'Red', '🛑', `The user does not have that much XP! They have ${data.XP}, you inputted ${number}.`, true);

                data.XP - number;

                data.save();

                return Reply(interaction, 'Green', '✅', `Successfully removed ${number} XP from ${user}.`, false);
            }
            break;
        }
    }
}