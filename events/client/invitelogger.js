const { Client, PermissionFlagsBits, Collection } = require('discord.js');
const invite = require('../../models/invite');
const wait = require("timers/promises").setTimeout;

module.exports = {
    name: 'ready',

    /**
     * 
     * @param {Client} client
     */

    async execute(client) {
        await wait(2000);

        client.guilds.cache.forEach(async (guild) => {
            const clientMember = guild.members.cache.get(client.user.id);

            if(!clientMember.permissions.has(PermissionFlagsBits.ManageGuild)) return;

            const firstInvites = await guild.invites.fetch();

            client.invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
        })
    }
}