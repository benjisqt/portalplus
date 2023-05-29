const { Collection, Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
console.clear();

const { Guilds, GuildMessages, GuildMembers, DirectMessages, GuildModeration, GuildInvites, GuildVoiceStates, GuildPresences, GuildWebhooks, GuildMessageReactions } = GatewayIntentBits;
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;

const client = new Client({
    intents: [Object.keys(GatewayIntentBits), 'GuildMessageReactions'],
    partials: [Object.keys(Partials)],
});

module.exports = client;

client.snipes = new Map();
client.invites = new Collection();

client.config = require('./config.json');
client.commands = new Collection();
const handlers = require('./util/handlers');
const process = require('node:process');

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection At:', promise, 'reason:', reason);
    const ch = client.channels.cache.get('1100148844920057967');
    ch.send({ embeds: [
        new EmbedBuilder()
        .setTitle(`Portal+ has experienced an error!`)
        .setColor('Red')
        .setDescription(`The following is the unhandled rejection report:\n\nReason: ${reason}`)
    ]});
});

process.on('uncaughtException', (reason, promise) => {
    console.log('Unhandled Rejection At:', promise, 'reason:', reason);
    const ch = client.channels.cache.get('1100148844920057967');
    ch.send({ embeds: [
        new EmbedBuilder()
        .setTitle(`Portal+ has experienced an error!`)
        .setColor('Red')
        .setDescription(`The following is the uncaught exception report:\n\nReason: ${reason}`)
    ]});
});

process.on('uncaughtExceptionMonitor', (reason, promise) => {
    console.log('Unhandled Rejection At:', promise, 'reason:', reason);
    const ch = client.channels.cache.get('1100148844920057967');
    ch.send({ embeds: [
        new EmbedBuilder()
        .setTitle(`Portal+ has experienced an error!`)
        .setColor('Red')
        .setDescription(`The following is the uncaught exception monitor report:\n\nReason: ${reason}`)
    ]});
});

// client login
client.login(client.config.token).then(() => {
    handlers.loadCommands(client);
    handlers.loadEvents(client);
    handlers.mongooseConnect(client);
}).catch(err => {
    console.log(`${chalk.red(chalk.bold(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.bold(`Something went wrong while running the client:`)} ${err}`);
});