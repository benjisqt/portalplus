const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } = require('discord.js');
const xp = require('../../models/xp');
const xprewards = require('../../models/XPRewards');
const vip = require('../../models/vip');
const vipcodes = require('../../models/vipcodes');
const { Reply } = require('../../util/replies');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('xprewards')
    .setDescription('XP Rewards!')
    .addSubcommand((sub) =>
        sub.setName('claimreward')
        .setDescription('Claim an XP Reward!')
        .addStringOption((opt) =>
            opt.setName('id')
            .setDescription('The ID of the reward')
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
        sub.setName('listunclaimed')
        .setDescription('List all of your unclaimed rewards!')
    )
    .addSubcommand((sub) =>
        sub.setName('listclaimed')
        .setDescription('List all of your claimed rewards')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {
        const id = interaction.options.getString('id');
        const sub = interaction.options.getSubcommand();
        const data = await xprewards.findOne({ Guild: interaction.guildId, User: interaction.user.id });

        switch(sub) {
            case 'claimreward': {
                if(data.Rewards.length <= 0) return Reply(interaction, 'Red', '🛑', `Hmm, you don't appear to have any rewards.`, true);

                if(!data.Rewards.includes(id)) {
                    if(data.ClaimedRewards.includes(id)) {
                        return Reply(interaction, 'Red', '🛑', `That reward has already been claimed!`, true);
                    }

                    return Reply(interaction, 'Red', '🛑', `You do not appear to have that reward...`, true);
                }

                const index = data.Rewards.indexOf(id);

                data.Rewards.splice(index, 1);

                data.ClaimedRewards.push(id);

                data.save();

                if(id === 'Free Portal+ VIP - 3 Months') {
                    const duration = '3month'

                    const generatedCode = Math.random().toString(36).substring(2, 8);

                    const newCode = await new vipcodes({
                        Code: generatedCode,
                        Length: duration,
                    });
    
                    newCode.save();

                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`:coin: Reward Claimed :coin:`)
                            .setDescription(`> A reward has been claimed. Thanks for your loyalty to Portal+!\nNOTE: To claim the reward, you must have Administrator permissions. Run /vip redeem, followed by the code, to redeem your Portal+ VIP!`)
                            .addFields(
                                { name: 'Reward', value: `${id}` },
                                { name: 'Duration', value: `3 Months` },
                                { name: 'Code To Redeem', value: `${newCode}` }
                            )
                            .setColor('Gold')
                        ], ephemeral: true
                    });
                }
            }
            break;

            case 'listunclaimed': {
                if(data.Rewards.length <= 0) return Reply(interaction, 'Red', '🛑', `You do not appear to have any unclaimed rewards...`, true);

                let rewardsarray = [];

                data.Rewards.forEach(reward => {
                    rewardsarray.push(`ID: ${reward}`)
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`All Unclaimed Rewards`)
                        .setDescription(`> Below are all of the rewards that you have not claimed yet.\n\n**${rewardsarray.join('\n')}**`)
                        .setColor('Gold')
                    ]
                });
            }
            break;

            case 'listclaimed' : {
                if(data.ClaimedRewards.length <= 0) return Reply(interaction, 'Red', '🛑', `You do not appear to have any claimed rewards...`, true);

                let rewardsarray = [];

                data.ClaimedRewards.forEach(reward => {
                    rewardsarray.push(`ID: ${reward}`)
                });

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`All Claimed Rewards`)
                        .setDescription(`> Below are all of the rewards that you have claimed.\n\n**${rewardsarray.join('\n')}**`)
                        .setColor('Gold')
                    ]
                });
            }
            break;
        }
    }
}