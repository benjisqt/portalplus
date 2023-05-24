const { Client, Message } = require('discord.js');
const capslimit = require('../../models/capslimit');

module.exports = {
    name: 'messageCreate',
    
    /**
     * 
     * @param {Message} message
     * @param {Client} Client
     */

    async execute(message, client) {
        const { guild, content } = message;

        const data = await capslimit.findOne({ Guild: guild.id });
        if(!data) return;

        var uppercases = content.replace(/[^A-Z]/g, '').length;

        if(uppercases > data.CapsLimit) {
            const msg = await message.reply({
                content: `Refrain from sending so many capitals! The limit in this server is ${data.CapsLimit} per message.`
            });

            message.delete();

            setTimeout(() => {
                msg.delete();
            }, 1500);
        }
    }
}