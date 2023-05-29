const { GuildMember, Client } = require('discord.js');
const invite = require('../../models/invite');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * 
     * @param {GuildMember} member
     * @param {Client} client
     */

    async execute(member, client) {
        const data = await invite.findOne({ Guild: member.guild.id });
        if(!data) return;

        const channelId = data.Channel;

        const channel = await member.guild.channels.cache.get(channelId);
        if(!channel) return;

        const newInvites = await member.guild.invites.fetch();

        const oldInvites = client.invites.get(member.guild.id);

        const invite = newInvites.find(i => i.uses > oldInvites.get(i.code));

        const inviter = await client.users.fetch(invite.inviter.id);

        inviter
            ? channel.send(`${member.user.tag} joined the server using the invite ${invite.code} from ${inviter.tag}. This invite has been used ${invite.uses} times since its creation.`)
            : channel.send(`${member.user.tag} joined the server but I am unable to see the invite they used.`);
    }
}