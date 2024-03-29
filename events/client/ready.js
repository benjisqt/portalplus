const chalk = require('chalk');
const { Client, ActivityType } = require('discord.js');
const presence = require('../../util/presence.json');
const commit = require('git-commit-count');

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {
        commit();
        const count = commit('benjisqt/portalplus');
        const commitcount = count / 10;

        client.user.setActivity({
            name: `${client.guilds.cache.size} guilds`,
            type: ActivityType.Watching,
        });

        let acname;

        let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        setInterval(() => {
            const ranStatus = Math.floor(Math.random() * 5) + 1;

            if(ranStatus === 1) acname = `over ${client.users.cache.size} users`;
            if(ranStatus === 2) acname = `me be the best Discord bot`;
            if(ranStatus === 3) acname = `my ${client.commands.size} commands`;
            if(ranStatus === 4) acname = `version 1.${commitcount}`;
            if(ranStatus === 5) acname = `over my support server`;

            client.user.setActivity({
                name: `${acname}`,
                type: ActivityType.Watching
            });
        }, 15000)

        return console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Client Connected!`)));
    }
}