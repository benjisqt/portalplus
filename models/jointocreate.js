const { model, Schema } = require('mongoose');

module.exports = model('jointocreate', new Schema({
    Guild: String,
    Channel: String,
    Category: String,
    VoiceLimit: Number,
    ErrorChannel: String,
}))