const { model, Schema } = require('mongoose');

module.exports = model('blacklistuser', new Schema({
    Guild: String,
    UserIDs: Array,
}));