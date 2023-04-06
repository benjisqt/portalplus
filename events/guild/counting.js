const { Message, Client } = require('discord.js');
const counting = require('../../models/counting');
const { Reply } = require('../../util/replies');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        const data = await counting.findOne({ Guild: message.guild.id });
        if(!data) return;

        const ch = message.guild.channels.cache.get(data.Channel);
        if(!ch) return;

        if(message.channelId !== ch.id) return;

        if(isNaN(message.content)) return;

        if(Number(message.content) === data.Number + 1){
            data.Number++
            data.save();
            message.react('✅');
            return;
        } else {
            data.Number = 0;
            data.save();
            const msg = await message.reply({ content: `${message.author} RUINED it at ${message.content}, restarting from 0.` });
            setTimeout(async () => {
                if(message.content > 100) {
                    await message.channel.bulkDelete(100);
                } else {
                    await message.channel.bulkDelete(message.content);
                }
            }, 3000);
        }
    }
}