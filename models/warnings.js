const { model, Schema } = require('mongoose');

module.exports = model('warnings', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Moderator: String,
}))