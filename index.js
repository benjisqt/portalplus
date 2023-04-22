console.clear();
const { ShardingManager } = require('discord.js');
const chalk = require('chalk');
const config = require('./config.json').token;

const manager = new ShardingManager('./bot.js', { token: config });

manager.on('shardCreate', async (shard) => {
    return console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Shard ${shard.id} Launched!`)));
});

try {
    manager.spawn();
} catch (err) {
    return console.log(chalk.red(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` Shard Failed To Launch!`)));
}