const { GuildMember, Client, ChannelType } = require('discord.js');
const ms = require('ms');
const timeSpan = ms('2d');
const altdetection = require('../../models/altdetection');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member, client) {
        const data = await altdetection.findOne({ Guild: member.guild.id });

        if(!data) return;

        const createdAt = new Date(member.user.createdAt).getTime();

        const difference = Date.now() - createdAt;

        if(difference < timeSpan) {
            member.guild.channels.cache.find(c => c.permissionsFor(client.user).has('SendMessages') && c.type === ChannelType.GuildText[0]).send({
                content: `\`✅\` Alt account successfully banned!\n**User:** ${member.user.tag}\n**Created At:** <t:${member.user.createdAt / 1000}:R>`
            });

            if(data.Punishment === 'ban') return member.ban({ reason: `Alt account detected! Account is newer than 1 day.` });
            if(data.Punishment === 'kick') return member.kick({ reason: `Alt account detected! Account is newer than 1 day.` });
        }
    }
}