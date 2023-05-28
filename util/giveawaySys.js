const { GiveawaysManager: gw } = require('discord-giveaways');
const giveawaymodel = require('../models/gievawayschema');

module.exports = class GiveawaysManager extends gw {
    async getAllGiveaways() {
        return await giveawaymodel.find().lean().exec();
    }

    async saveGiveaway(messageId, giveawayData) {
        return await giveawaymodel.create(giveawayData);
    }

    async editGiveaway(messageId, giveawayData) {
        return await giveawaymodel.updateOne({ messageId }, giveawayData, { omitUndefined: true }).exec();
    }

    async deleteGiveaway(messageId) {
        return await giveawaymodel.deleteOne({ messageId }).exec();
    }
}