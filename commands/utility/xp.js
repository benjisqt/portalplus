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
    ).addSubcommand((sub) =>
        sub.setName('addmultiplier')
        .setDescription('Add an XP multiplier to a user!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to add the multiplier for!')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('multiplier')
            .setDescription('The multiplier you want to add')
            .setRequired(true)
            .addChoices(
                { name: 'Add 0.5x', value: '0.5x' },
                { name: 'Add 1x', value: '1x' },
                { name: 'Add 1.5x', value: '1.5x' },
                { name: 'Add 2x', value: '2x' }
            )
        )
    ).addSubcommand((sub) =>
        sub.setName('removemultiplier')
        .setDescription('Remove an XP multiplier from a user!')
        .addUserOption((opt) =>
            opt.setName('user')
            .setDescription('The user you want to remove the multiplier from!')
            .setRequired(true)
        )
        .addStringOption((opt) =>
            opt.setName('multiplier')
            .setDescription('The multiplier you want to remove')
            .setRequired(true)
            .addChoices(
                { name: 'Remove 0.5x', value: '0.5x' },
                { name: 'Remove 1x', value: '1x' },
                { name: 'Remove 1.5x', value: '1.5x' },
                { name: 'Remove 2x', value: '2x' }
            )
        )
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const number = interaction.options.getNumber('xp');
        const multiplier = interaction.options.getString('multiplier');
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
            case 'addmultiplier': {
                const data = await xp.findOne({ Guild: interaction.guildId, User: user.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user does not have any XP.`, true);

                let addmultiplier;

                if(multiplier === '0.5x') addmultiplier = 0.5;
                if(multipler === '1x') addmultiplier = 1;
                if(multiplier === '1.5x') addmultiplier = 1.5;
                if(multiplier === '2x') addmultiplier = 2;

                data.XPMultiplier + addmultiplier;

                data.save();

                return Reply(interaction, 'Green', '✅', `Successfully added ${multiplier} XP Multiplier to ${user}, their multiplier is now ${data.XPMultipler}.`, false);
            }
            break;
            case 'remove': {
                const data = await xp.findOne({ Guild: interaction.guildId, User: user.id });
                if(!data) return Reply(interaction, 'Red', '🛑', `That user does not have any XP.`, true);
                if(data.XPMultiplier <= 1) return Reply(interaction, 'Red', '🛑', `That user does not have any additional XP Multipliers.`, true);

                let addmultiplier;

                if(multiplier === '0.5x') addmultiplier = 0.5;
                if(multipler === '1x') addmultiplier = 1;
                if(multiplier === '1.5x') addmultiplier = 1.5;
                if(multiplier === '2x') addmultiplier = 2;

                if(addmultiplier > data.XPMultiplier) return Reply(interaction, 'Red', '🛑', `The user does not have that much XP Multiplier! They have ${data.XPMultiplier}x, you inputted ${multiplier}.`, true);

                data.XPMultiplier - addmultiplier;

                data.save();

                return Reply(interaction, 'Green', '✅', `Successfully removed ${addmultiplier}x XP Multiplier from ${user}.`, false);
            }
            break;
        }
    }
}