const { GuildMember, Client, ChannelType, EmbedBuilder } = require('discord.js');
const antijoin = require('../../models/antijoin');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member, client) {
        const data = await antijoin.findOne({ Guild: member.guild.id });
        if(data) {
            if(data.Enabled === true) {
                const punishment = data.Punishment;
                if(punishment === 'ban') {
                    let found = false;
                    member.guild.channels.cache.forEach(ch => {
                        if(found) return;
                        if(ch.type === ChannelType.GuildText && ch.permissionsFor(member.guild.members.me).has('SendMessages')) {
                            ch.send({ embeds: [
                                new EmbedBuilder()
                                .setTitle(`Antijoin: User Banned`)
                                .addFields(
                                    { name: 'User ID', value: `${member.id}` },
                                    { name: 'User Tag', value: `${member.user.tag}` },
                                    { name: 'Joined Discord', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>` },
                                    { name: 'Punishment Given', value: `Ban` }
                                )
                                .setColor('Red')
                            ] })
                            found = true;
                        }
                    })
                    return member.ban({ reason: 'Antijoin system enabled!' });
                } else if(punishment === 'kick') {
                    let found = false;
                    member.guild.channels.cache.forEach(ch => {
                        if(found) return;
                        if(ch.type === ChannelType.GuildText && ch.permissionsFor(member.guild.members.me).has('SendMessages')) {
                            ch.send({ embeds: [
                                new EmbedBuilder()
                                .setTitle(`Antijoin: User Kicked`)
                                .addFields(
                                    { name: 'User ID', value: `${member.id}` },
                                    { name: 'User Tag', value: `${member.user.tag}` },
                                    { name: 'Joined Discord', value: `<t:${parseInt(member.user.createdTimestamp / 1000)}:R>` },
                                    { name: 'Punishment Given', value: `Kick` }
                                )
                                .setColor('Red')
                            ] })
                            found = true;
                        }
                    })
                    return member.kick({ reason: 'Antijoin system enabled!' });
                }
            } else {
                return;
            }
        } else {
            return;
        }
    }
}