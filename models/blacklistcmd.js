const { model, Schema } = require('mongoose');

module.exports = model('blacklistcmd', new Schema({
    Guild: String,
    Commands: Array,
}));