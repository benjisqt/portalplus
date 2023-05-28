const { GiveawaysManager } = require('discord-giveaways');
const client = require('./index');

const giveawayManager = new GiveawaysManager(client, {
    default: {
        botsCanWin: false,
        embedColor: `Gold`,
        embedColorEnd: `Red`,
        reaction: `🎁`,
    },
});

module.exports = giveawayManager;