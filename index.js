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

// MUSIC SECTION
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const player = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: true,
    plugins: [
        new SpotifyPlugin()
    ]
});

console.log(chalk.magenta(chalk.italic(`System`)) + chalk.white(chalk.bold(` >>`)) + chalk.green(chalk.bold(` DisTube Initialised!`)));

module.exports = player;

// DisTube Events!!
const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
player
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `✅ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `✅ | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`❌ | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('Voice channel is empty! Leaving the channel...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`❌ | No result found for \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))

// client login
client.login(client.config.token).then(() => {
    handlers.loadCommands(client);
    handlers.loadEvents(client);
    handlers.mongooseConnect(client);
}).catch(err => {
    console.log(`${chalk.red(chalk.bold(`System`))} ${chalk.white(chalk.bold(`>>`))} ${chalk.bold(`Something went wrong while running the client:`)} ${err}`);
});