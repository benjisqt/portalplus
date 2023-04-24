const { Collection, Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');
const chalk = require('chalk');
console.clear();

const { Guilds, GuildMessages, GuildMembers, DirectMessages, GuildModeration, GuildInvites, GuildVoiceStates, GuildPresences, GuildWebhooks } = GatewayIntentBits;
const { Channel, GuildMember, Message, Reaction, ThreadMember, User, GuildScheduledEvent } = Partials;

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
    partials: [Object.keys(Partials)],
});

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
        .setDescription(`The following is the unhandled rejection report:\n\n${promise}\n\nReason: ${reason}`)
    ]});
})

client.login(client.config.token).then(() => {
    handlers.loadCommands(client);
    handlers.loadEvents(client);
    handlers.mongooseConnect(client);
}).catch(err => {
    console.log(`${chalk.red(chalk.bold(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.bold(`Something went wrong while running the client:`)} ${err}`);
});