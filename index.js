const { Collection, Client, GatewayIntentBits, Partials } = require('discord.js');
const chalk = require('chalk');
console.clear();

const { Guilds, GuildMessages, GuildMembers, DirectMessages, GuildModeration, GuildInvites, GuildVoiceStates, GuildPresences } = GatewayIntentBits;
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

client.config = require('./config.json');
client.commands = new Collection();
const handlers = require('./util/handlers');

client.login(client.config.token).then(() => {
    handlers.loadCommands(client);
    handlers.loadEvents(client);
    handlers.mongooseConnect(client);
}).catch(err => {
    console.log(`${chalk.red(chalk.bold(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.bold(`Something went wrong while running the client:`)} ${err}`);
});