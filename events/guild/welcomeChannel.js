const { GuildMember, Client, EmbedBuilder } = require('discord.js');
const welcomeChannel = require('../../models/welcomeChannel');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member, client) {
        const { guild } = member;

        const data = await welcomeChannel.findOne({ Guild: guild.id });
        if(!data) return;
        const channel = await guild.channels.cache.get(data.Channel);
        if(!channel) return;
        if(!channel.permissionsFor(client.user).has('SendMessages')) return;

        channel.send({
            content: `${data.Message}`,
            embeds: [
                new EmbedBuilder()
                .setTitle(`New Member Joined`)
                .addFields(
                    { name: 'Member Joined Discord', value: `<t:${Math.round(member.user.createdTimestamp / 1000)}:R>`, inline: true },
                    { name: 'Member Joined Server', value: `<t:${Math.round(member.joinedTimestamp / 1000)}:R>`, inline: true },
                )
                .setThumbnail(guild.iconURL({ size: 1024, dynamic: true }))
                .setColor('Gold')
            ]
        })
    }
}