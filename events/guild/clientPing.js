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
                const msg = await message.reply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`Hey! I'm Portal+`)
                        .setDescription(`Friendly reminder, my prefix is /, I only support slash commands! :)\nHave a good day!`)
                        .setFooter({ text: `portal+ being friendly?!` })
                        .setColor('Green')
                        .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                    ]
                });

                setTimeout(() => {
                    msg.edit({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`Hey! I'm Portal+`)
                            .setDescription(`Friendly reminder, my prefix is /, I only support slash commands! :)\nHave a good day!`)
                            .setFooter({ text: `portal+ being friendly?!` })
                            .setColor('Orange')
                            .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                        ]
                    });

                    setTimeout(() => {
                        msg.edit({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`Hey! I'm Portal+`)
                                .setDescription(`Friendly reminder, my prefix is /, I only support slash commands! :)\nHave a good day!`)
                                .setFooter({ text: `portal+ being friendly?!` })
                                .setColor('Red')
                                .setThumbnail(client.user.displayAvatarURL({ size: 1024 }))
                            ]
                        });

                        setTimeout(() => {
                            msg.delete();
                        }, 1000);
                    }, 1000)
                }, 1000);
            } else return;
        } else return;
    }
}