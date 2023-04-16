const chalk = require('chalk');
const { Client, ActivityType } = require('discord.js');
const presence = require('../../util/presence.json');

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {
        const activity = presence.activity;
        const type = presence.type;

        let actype;

        if(type === 'Watching') actype = ActivityType.Watching;

        if(activity.includes('{guilds}')) {
            let at = await activity.replace('{guilds}', `${client.guilds.cache.size}`);

            client.user.setActivity({
                name: `${at}`,
                type: actype,
            });
        }

        return console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Client Connected!`)));
    }
}