const chalk = require('chalk');
const { Client, ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {
        client.user.setActivity({
            name: `${client.guilds.cache.size} guilds`,
            type: ActivityType.Watching,
        });

        return console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Client Connected!`)));
    }
}