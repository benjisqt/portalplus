const chalk = require('chalk');
const { SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js');
const { loadCommands, loadEvents } = require('../../util/handlers');
const { Reply } = require('../../util/replies');

module.exports = {
    owner: true,
    category: 'Owner',
    data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload commands or events')
    .addSubcommand((sub) =>
        sub.setName('commands')
        .setDescription('Reload commands on the bot')
    )
    .addSubcommand((sub) =>
        sub.setName('events')
        .setDescription('Reload events on the bot')
    ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();

        switch(sub) {
            case 'commands' : {
                loadCommands(client);
                console.log(`${chalk.magenta(chalk.italic(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.green(chalk.bold(`Commands Reloaded By ${interaction.user.tag}!`))}`);
                return Reply(interaction, 'Green', '✅', 'Successfully reloaded commands!', true);
            }
            break;

            case 'events' : {
                loadEvents(client);
                console.log(`${chalk.magenta(chalk.italic(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.green(chalk.bold(`Events Reloaded By ${interaction.user.tag}!`))}`);
                return Reply(interaction, 'Green', '✅', 'Successfully reloaded events!', true);
            }
            break;
        }
    }
}