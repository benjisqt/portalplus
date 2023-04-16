const { GuildMember, Client } = require('discord.js');
const autorole = require('../../models/autorole');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member 
     * @param {Client} client 
     */

    async execute(member, client) {
        const data = await autorole.findOne({ Guild: member.guild.id });
        if(!data) return;
        
        const role = member.guild.roles.cache.get(data.Role);
        if(!role) return;

        if(role.position > member.guild.members.me.roles.highest.position) return;

        member.roles.add(role);
    }
}