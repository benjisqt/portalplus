const { model, Schema } = require('mongoose');

module.exports = model('modlogs', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Command: String,
    Target: String,
}))