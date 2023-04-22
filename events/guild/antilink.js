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
        const blocked = [
            'https',
            'http',
            'www',
            '.gg',
            '.com',
        ];

        if(blocked.includes(message.content)) {
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