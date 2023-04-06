const { Message, Client } = require('discord.js');
const vip = require('../../models/vip');
const vipcodes = require('../../models/vipcodes');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        if(message.author.bot) return;

        const data = await vip.findOne({ Guild: message.guild.id });
        if(!data) return;
        if(Date.now() > data.Expires) {
            message.reply({ content: `Your premium subscription has run out. You will no longer be able to use VIP commands.` });
            const dater = await vipcodes.findOne({ Code: data.Code });
            dater.deleteOne({ Code: data.Code });
            data.deleteOne({ Guild: message.guild.id });
        }
    }
}