const { Message, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'messageCreate',

    /**
     * 
     * @param {Message} message
     * @param {Client} client
     */

    async execute(message, client) {
        if(message.author.bot) return;
        if(!message.inGuild()) return;
        if(message.mentions.members.has(client.user.id)) {
            if(message.channel.permissionsFor(client.user).has('SendMessages')) {
                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Hey! I'm Portal+`)
                        .setDescription(`Friendly reminder, my prefix is /, I only support slash commands! :)\nHave a good day!`)
                        .setFooter({ text: `Portal+ being friendly?!` })
                        .setColor('Gold')
                        .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                    ]
                })
            } else return;
        } else return;
    }
}