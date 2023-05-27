const client = require('./index');
const youtube = require('discord-youtube');
const JoshMongo = require('@joshdb/mongo');

const yt = new youtube(client, {
    provider: JoshMongo,
    providerOptions: {
        url: 'mongodb+srv://benji:Stargate@cluster0.8smrzqe.mongodb.net/?retryWrites=true&w=majority',
        collection: 'YoutubePoster'
    },
    loop_delays_in_min: 5,
    defaults: {
        Notification: "<@{discorduser}> Posted: **{videotitle}**, as `{videoauthorname}`\n{videourl}"
    }
});

module.exports = yt;