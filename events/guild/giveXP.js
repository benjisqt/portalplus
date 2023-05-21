const { Message, Client, EmbedBuilder } = require('discord.js');
const xp = require('../../models/xp');
const { getRandomXP } = require('../../util/getRandomXP');
const calculateLevelXP = require('../../util/calculateLevelXP');
const preventSpam = new Set();
const XPRewards = require('../../models/XPRewards');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        if(!message.inGuild() || message.author.bot || preventSpam.has(message.author.id)) return;

        const XPToGive = getRandomXP(5, 15);

        const query = {
            User: message.author.id,
            Guild: message.guildId,
        };

        const data = await xp.findOne(query);
        if(data) {
            const newxp = XPToGive * data.XPMultiplier;

            const oldxp = data.XP / 10

            data.XP += newxp;

            const rewardsdata = await XPRewards.findOne({ Guild: message.guild.id, User: message.author.id });

            if(!rewardsdata) {
                await XPRewards.create({
                    Guild: message.guild.id,
                    User: message.author.id,
                    ClaimedRewards: [],
                    Rewards: []
                });
            }

            if(data.XP > calculateLevelXP(data.Level)) {
                data.Level += 1;
                data.XP = calculateLevelXP(data.Level) / 10

                preventSpam.add(message.author.id);

                setTimeout(() => {
                    preventSpam.delete(message.author.id);
                }, 1500)

                const msg = await message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                        .setDescription(`🏆 Well Done ${message.author.username}, you levelled up to level ${data.Level}!`)
                        .setColor('Green')
                    ]
                });

                setTimeout(() => {
                    msg.edit({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription(`🏆 Well Done ${message.author.username}, you levelled up to level ${data.Level}!`)
                            .setColor('Orange')
                        ]
                    });

                    setTimeout(() => {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setDescription(`🏆 Well Done ${message.author.username}, you levelled up to level ${data.Level}!`)
                                .setColor('Red')
                            ]
                        });
                    }, 1000);

                    setTimeout(() => {
                        msg.delete();
                    }, 1000);
                }, 1000);

                await data.save();
                
                if(data.Level >= 50 && !rewardsdata.Rewards.includes('Free Portal+ VIP - 3 Months')) {
                    if(rewardsdata.ClaimedRewards.includes('Free Portal+ VIP - 3 Months')) return;
                    message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`You have unlocked a reward! 🔓`)
                            .setDescription(`Since you have reached level 50, you have obtained a free Portal+ VIP license for 3 months!\nTo claim this reward, simply type /xprewards claim, and then the ID!\nNOTE: The ID can be obtained by running /xprewards listunclaimed to view all rewards you haven't claimed!`)
                            .setColor('Gold')
                            .setFooter({ text: `Portal+ Levelling System Rewards!` })
                        ]
                    });

                    rewardsdata.Rewards.push('Free Portal+ VIP - 3 Months');
                    rewardsdata.save();
                }
            } else {
                await data.save();
            }
        } else {
            await xp.create({
                Guild: message.guildId,
                User: message.author.id,
                Level: 0,
                XP: 0,
                XPMultiplier: 1.0
            })
        }
    }
}