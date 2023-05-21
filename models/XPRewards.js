const { model, Schema } = require('mongoose');

module.exports = model('xprewards', new Schema({
    Guild: String,
    User: String,
    Rewards: Array,
    ClaimedRewards: Array,
}))