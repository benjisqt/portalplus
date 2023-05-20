const { Message, Client, EmbedBuilder } = require('discord.js');
const xp = require('../../models/xp');
const { getRandomXP } = require('../../util/getRandomXP');
const calculateLevelXP = require('../../util/calculateLevelXP');
const preventSpam = new Set();

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
            data.XP += XPToGive;

            const oldxp = data.XP / 10

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