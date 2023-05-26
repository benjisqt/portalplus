const { Client, ChannelType, EmbedBuilder } = require('discord.js');
const vip = require('../../models/vip');
const vipcodes = require('../../models/vipcodes');

module.exports = {
    name: 'ready',

    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        const data = await vip.find();
        if(!data) return;

        data.forEach(date => {
            if(Date.now() >= date.Expires) {
                const guilds = client.guilds.cache.get(date.Guild);
                const validch = guilds.channels.cache.filter(ch => ch.permissionsFor(guilds.members.me).has('SendMessages') && ch.type === ChannelType.GuildText).first();
                if(!validch) return;
                validch.send({ embeds: [
                    new EmbedBuilder()
                    .setTitle(`VIP License Expired`)
                    .setDescription(`Your VIP license has expired. This means you will not be able to use VIP commands until a new license is redeemed.`)
                    .setColor('Gold')
                    .addFields(
                        {
                            name: 'Duration',
                            value: `${date.Duration}`
                        }
                    )
                    .setThumbnail(guilds.iconURL({ dynamic: true }))
                ] }).catch(err => {
                    return;
                })
                date.deleteOne({ Guild: date.Guild });
            }
        })

        setInterval(async () => {
            const data = await vip.find();
            if(!data) return;
    
            data.forEach(date => {
                if(Date.now() > date.Expires) {
                    const guilds = client.guilds.cache.get(date.Guild);
                    const validch = guilds.channels.cache.filter(ch => ch.permissionsFor(guilds.members.me).has('SendMessages')).first();
                    if(!validch) return;
                    validch.send({ embeds: [
                        new EmbedBuilder()
                        .setTitle(`VIP License Expired`)
                        .setDescription(`Your VIP license has expired. This means you will not be able to use VIP commands until a new license is redeemed.`)
                        .setColor('Gold')
                        .addFields(
                            {
                                name: 'Duration',
                                value: `${date.Duration}`
                            }
                        )
                        .setThumbnail(guilds.iconURL({ dynamic: true }))
                    ] });
                    date.deleteOne({ Guild: date.Guild });
                }
            })
        }, 90000)
    }
}