const { Message, Client, EmbedBuilder } = require('discord.js');
const antispam = require('../../models/antispam');
const map = new Map();

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        if(message.author.bot || !message.guild) return;

        const channelData = await antispam.findOne({ Guild: message.guildId });
        if(!channelData) return;

        if(channelData.Exceptions.includes(message.author.id)) return;
        
        if(map.has(message.author.id)) {
            const data = map.get(message.author.id);
            const { lastmsg, timer } = data;
            const diff = message.createdTimestamp - lastmsg.createdTimestamp;
            let msgs = data.msgs;

            if(diff > 2000) {
                clearTimeout(timer);

                data.msgs = 1
                data.lastmsg = message

                data.timer = setTimeout(() => {
                    map.delete(message.author.id);
                }, 5000)

                map.set(message.author.id, data);
            } else {
                ++msgs

                if(parseInt(msgs) === 5) {
                    const member = message.guild.members.cache.get(message.author.id);

                    member.timeout(1 * 60 * 1000, 'Spamming.').catch(err => {
                        console.log(err);
                    });

                    message.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Antispam System`)
                            .setDescription(`> You have been timed out for spamming.`)
                            .addFields(
                                { name: 'Duration', value: '60s' },
                                { name: 'Reason', value: 'Spamming.' },
                            )
                            .setColor('Gold')
                            .setFooter({ text: `Portal+ Antispam System` })
                            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                        ]
                    });
                } else {
                    data.msgs = msgs;
                    map.set(message.author.id, data);
                }
            }
        } else {
            let remove = setTimeout(() => {
                map.delete(message.author.id);
            }, 5000);

            map.set(message.author.id, {
                msgs: 1,
                lastmsg: message,
                timer: remove,
            });
        }
    }
}