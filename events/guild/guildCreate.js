const { Client, Guild, ActivityType } = require('discord.js');
const presence = require('../../util/presence.json');

module.exports = {
    name: 'guildCreate',

    /**
     * 
     * @param {Guild} guild
     * @param {Client} client
     */

    async execute(guild, client) {
        const activity = presence.activity;
        const type = presence.type;
        if(!presence.activity.includes('{guilds}')) return;

        let at = await activity.replace('{guilds}', `${client.guilds.cache.size}`);

        let actype;

        if(type === 'Watching') actype = ActivityType.Watching;

        client.user.setActivity({
            name: `${at}`,
            type: actype,
        });
    }
}