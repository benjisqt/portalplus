const { GuildMember, Client } = require('discord.js');
const memberCounter = require('../../models/memberCounter');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member, client) {
        const { guild } = member;

        const data = await memberCounter.findOne({ Guild: guild.id });

        if(!data) return;

        const ch = guild.channels.cache.get(data.Channel);
        if(!ch) return;

        ch.setName(`👥 Members: ${guild.memberCount}`);
    }
}