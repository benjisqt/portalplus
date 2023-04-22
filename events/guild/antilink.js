const { Message, Client } = require('discord.js');
const antilink = require('../../models/antilink');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        if(message.content.startsWith('https') || message.content.startsWith('http') || message.content.startsWith('www') || message.content.startsWith('discord.gg') || message.content.includes('https') || message.content.includes('http') || message.content.includes('www') || message.content.includes('discord.gg')) {
            const data = await antilink.findOne({ Guild: message.guildId });
            if(!data) return;

            const msg = await message.reply({
                content: `\`❗️\` Antilink is enabled! Do not attempt to send links!`,
            });

            message.delete();

            setTimeout(() => {
                msg.delete();
            }, 3000)
        }
    }
}