const chalk = require('chalk');
const { Client, ActivityType } = require('discord.js');
const vip = require('../../models/vip');

module.exports = {
    name: 'ready',

    /**
     * @param {Client} client
     */

    async execute(client) {
        setInterval(async () => {
            let date = new Date();
            const expired = await vip.findOne({ Expires: date });
    
            if(expired) {
                const guilds = client.guilds.cache.get(expired.Guild);
                guilds.channels.cache.find(c => c.permissionsFor(guilds.members.me).has('SendMessages')[0]).send(`Your premium license has expired.`);
                expired.deleteOne({ Guild: e.Guild });
            }
        }, 1000)

        client.user.setActivity({
            name: `${client.guilds.cache.size} guilds`,
            type: ActivityType.Watching,
        });

        return console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Client Connected!`)));
    }
}